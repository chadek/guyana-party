import Map from './olMap'
import { b } from '../bling'
import { axiosGet } from '../utils'
var nextDay = require('next-day');

const map = new Map({
  mouseWheelZoom: true,
  zoom: 11
})

const searchInput = b('.search__input')
let searchInputValue = ''

map.singleShowPoint(coords => {
  if (searchInput) {
    const lon = coords[0].toString()
    const lat = coords[1].toString()
    searchInput.on('keydown', e => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        showEvents(e.target.value, lon, lat)
      }
    })
    searchInput.on('change', e => (searchInputValue = e.target.value))
    showEvents('', lon, lat)
  }
})

const aroundBtn = document.getElementById('around')
if (aroundBtn) {
  aroundBtn.on('click', () => {
    map.goAround((coords, show, err) => {
      if (err) {
        console.info(
          'Le suivit de position géographique a été bloqué pour cette page'
        )
        return
      }
      showEvents(searchInputValue, coords[0].toString(), coords[1].toString())
    })
  })
}

const randomBtn = document.getElementById('random')
if (randomBtn) {
  randomBtn.on('click', () => {
    map.goRandom(coords => {
      showEvents(searchInputValue, coords[0].toString(), coords[1].toString())
    })
  })
}

const newBtn = document.getElementById('new')
if (newBtn) {
  newBtn.on('click', () => (window.location = '/events/add'))
}

map.onMove((coords, distance) => {
  showEvents(
    searchInputValue,
    coords[0].toString(),
    coords[1].toString(),
    distance
  )
})

map.eventsOnClick(
  document.getElementById('popup'),
  onEventHTMLFn,
  onZoomMaxHTMLFn,
  userPosHTMLFn,
  coords => {}
)

function showEvents (search, lon, lat, maxDistance = 20000) {
  axiosGet(
    `/api/search?q=${search}&lon=${lon}&lat=${lat}&maxdistance=${maxDistance}`,
    data => {
      if (data && data.items) {
        map.showEvents(data.items)
        showEventsList(data.items)
      }
    }
  )
}

function formatEventStart (isoStart) {
<<<<<<< HEAD
  let start = new Date(isoStart)
  let month = start.getMonth()+1 
  let srtStartDate = `Le ${('0' + start.getDate()).slice(-2)}/${(
    '0' + month 
=======
  const start = new Date(isoStart)
  return `Le ${('0' + start.getDate()).slice(-2)}/${(
    '0' + start.getMonth()
>>>>>>> f3742d9f76b6a836de76f6e1233f4a34ba7c8417
  ).slice(-2)}/${start.getFullYear()} à ${('0' + start.getHours()).slice(
    -2
    )}:${('0' + start.getMinutes()).slice(-2)}`

  // return `Le ${('0' + start.getDate()).slice(-2)}/${(
  //   '0' + start.getMonth()
  // ).slice(-2)}/${start.getFullYear()} à ${('0' + start.getHours()).slice(
  //   -2
  // )}:${('0' + start.getMinutes()).slice(-2)}`
  return srtStartDate
}

function onEventHTMLFn (event) {
  const start = formatEventStart(event.get('start')) // start date format
  return `
    <div style="font-size:.8em">
      <font size="4">${event.get('name')}</font>
      <br><br>Organisateur: <a href="/organism/${event.get('author').slug}">${
  event.get('author').name
}</a><br><br>${start}
      <br><br><a href="/event/${event.get('slug')}">Plus d'info</a>
    </div>`
}

function onZoomMaxHTMLFn (events) {
  let content = `<div style="font-size:.8em">`
  events.forEach(event => {
    content += `<a href="/event/${event.get('slug')}">
            ${event.get('name')}</a> organisé par <a href="/organism/${
  event.get('author').slug
}">${event.get('author').name}</a><br>`
  })
  return `${content}</div>`
}

function userPosHTMLFn (coords, hdms) {
  return `
    <div style="font-size:.8em">
      <font size="3">Votre localisation<br>(basée sur l'adresse IP) :</font>
      <br><br><code>lon.: ${coords[0]}</code>
      <br><code>lat.: ${coords[1]}</code>
      <br><br><code>${hdms}</code>
    </div>`
}

function lookForNextOccurring (event){
  var NextDatesInTheWeek = []
  var nextdate
  const today = new Date()
  const end = new Date(event.end)

  // console.log("Date de début : " + event.start)
  // console.log(event)

  event.occurring.day.forEach(day =>{
    var Day = day.charAt(0).toUpperCase() + day.slice(1)
    var time = new Date(event.start)
    // console.log("Récurence en majuscule "+Day)
    nextdate = nextDay(today, nextDay[Day])
    // console.log("Prochaine occurrence au format moche : " + nextdate.date)
    var datetoiso = new Date(nextdate.date.toISOString())
    // console.log("Date to iso : "+ new Date(datetoiso))
    // maitenant il faut remettre la bonne heure!
    var bonneD = new Date(datetoiso.getFullYear(), datetoiso.getMonth(), datetoiso.getDate(), time.getHours(), time.getMinutes(), time.getMilliseconds(), time.getTimezoneOffset() )
    // console.log("tentative de bonne heure réussi ! "+ bonneD)
    // console.log("iso to texte : "+formatEventStart(bonneD))

    if (bonneD <= end){
      // si la prochaine occurrence est bien dans la période
      console.log("On passe de temps en temps dans le test")
      NextDatesInTheWeek.push(bonneD)
    }
    
  })

  console.log("NextDatesInTheWeek : " + NextDatesInTheWeek)
  if (NextDatesInTheWeek.length >= 1){
    NextDatesInTheWeek.sort(function(a,b){return a.getTime() - b.getTime()});
  }
  // console.log("La prochaine date est : "+ NextDatesInTheWeek[0])
  return formatEventStart(NextDatesInTheWeek[0])
}

//avant d'appeler la fonction formatEventStart, vérifier si l'évènement à quelque chose dans la liste 
// event.occurring.day === undefined || event.occurring.day.length == 0 
// si oui => chercher la date de la prochaine occurence puis retourner la date 


function showEventsList (events) {
  const homeList = document.getElementById('resultelements')
  homeList.innerHTML = ''
  events.forEach(event => {
    const imgSrc = event.photo
      ? `/uploads/${event.photo}`
      : '/images/icons/logo.png'
    var start = formatEventStart(event.start)

    console.log(event.occurring.day)

    if (event.occurring.day === undefined || event.occurring.day.length == 0){
      console.log("Il n'y a aps d'occ ici")
    }else{
      // const nextocc = lookForNextOccurring(event)
      start = lookForNextOccurring(event)
      // console.log(nextocc)
    }
    
    homeList.innerHTML += `
      <li class="pure-u-1 result-element"
        onclick="location.href='/event/${event.slug}'">
        <div><img src="${imgSrc}" alt="${event.name}"></div>
        <div>
          <h4>${event.name}</h4>
          <h4>${event.organism.name}</h4>
          <span>${start}</span>
          <br><code>${map.getGPSToHDMS(event.location.coordinates)}</code>
        </div>
      </li>`
  })
}

// <span>${nextocc}</span>