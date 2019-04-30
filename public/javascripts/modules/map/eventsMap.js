import Map from './olMap'
import { b } from '../bling'
import { axiosGet } from '../utils'
const nextDay = require('next-day')

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
  const start = new Date(isoStart)
  return `Le ${('0' + start.getDate()).slice(-2)}/${(
    '0' +
    (start.getMonth() + 1)
  ).slice(-2)}/${start.getFullYear()} à ${('0' + start.getHours()).slice(
    -2
  )}:${('0' + start.getMinutes()).slice(-2)}`
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

function lookForNextOccurring (event) {
  const NextDatesInTheWeek = []
  let nextdate
  const today = new Date()
  const end = new Date(event.end)

  console.log('Date de début : ' + event.start)
  // console.log(event)
  console.log('Datede fin ', event.end)
  const time = new Date(event.start)

  event.occurring.forEach(day => {
    nextdate = nextDay(today, day)
    console.log(nextdate)
    const datetoiso = new Date(nextdate.date.toISOString())
    console.log('date to iso', datetoiso)
    const bonneD = new Date(
      datetoiso.getFullYear(),
      datetoiso.getMonth(),
      datetoiso.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getMilliseconds(),
      time.getTimezoneOffset()
    )
    console.log('bonne Date', bonneD)

    if (bonneD <= end) {
      NextDatesInTheWeek.push(bonneD)
    }
  })

  console.log('Les occ', NextDatesInTheWeek)

  if (NextDatesInTheWeek.length >= 1) {
    NextDatesInTheWeek.sort(function (a, b) {
      return a.getTime() - b.getTime()
    })
  }
  return formatEventStartEnd(NextDatesInTheWeek[0], event.end)
}

function formatEventStartEnd (isoStart, isoEnd) {
  console.log(isoStart, isoEnd)
  const start = new Date(isoStart)
  const end = new Date(isoEnd)
  const month = start.getMonth() + 1
  const srtStartDate = `Le ${('0' + start.getDate()).slice(-2)}/${(
    '0' + month
  ).slice(-2)}/${start.getFullYear()} de ${('0' + start.getHours()).slice(
    -2
  )}:${('0' + start.getMinutes()).slice(-2)} à ${('0' + end.getHours()).slice(
    -2
  )}:${('0' + end.getMinutes()).slice(-2)}`

  return srtStartDate
}

function showEventsList (events) {
  const homeList = document.getElementById('resultelements')
  homeList.innerHTML = ''
  events.forEach(event => {
    const imgSrc = event.photo
      ? `/uploads/${event.photo}`
      : '/images/icons/logo.png'

    let start = formatEventStart(event.start)

    if (event.occurring !== undefined && event.occurring.length !== 0) {
      // const nextocc = lookForNextOccurring(event)
      start = lookForNextOccurring(event)
      console.log('HHello rec event')
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
