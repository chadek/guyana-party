import Map from './olMap'
import { axiosGet } from '../utils'

const map = new Map({
  mouseWheelZoom: true,
  zoom: 11
})

map.singleShowPoint(coords => {
  const search = document.querySelector('.search__input')
  if (search) {
    const lon = coords[0].toString()
    const lat = coords[1].toString()
    search.on('keydown', e => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        showEvents(e.target.value, lon, lat)
      }
    })
    showEvents(search.value, lon, lat)
  }
})

map.eventsOnClick(
  document.getElementById('popup'),
  onEventHTMLFn,
  onZoomMaxHTMLFn,
  userPosHTMLFn,
  coords => {}
)

function showEvents (search, lon, lat) {
  axiosGet(
    `/api/search?q=${search}&lon=${lon}&lat=${lat}&maxdistance=20000`,
    data => {
      if (data && data.items) {
        map.showEvents(data.items)
        showEventsList(data.items)
      }
    }
  )
}

function formatEventStart (isoStart) {
  let start = new Date(isoStart)
  return `Le ${('0' + start.getDate()).slice(-2)}/${(
    '0' + start.getMonth()
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

function showEventsList (events) {
  const homeList = document.getElementById('resultelements')
  homeList.innerHTML = ''
  events.forEach(event => {
    const imgSrc = event.photo
      ? `/uploads/${event.photo}`
      : '/images/icons/logo.png'
    const start = formatEventStart(event.start)
    homeList.innerHTML += `
      <li class="pure-u-1 result-element"
        onclick="location.href='/event/${event.slug}'">
        <div><img src="${imgSrc}" alt="${event.name}"></div>
        <div>
          <h4>${event.name}</h4>
          <h4>${event.organism.name}</h4>
          <span>${start}</span>
        </div>
      </li>`
  })
}
