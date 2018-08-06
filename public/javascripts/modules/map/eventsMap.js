import Map from './olMap'
import { axiosGet } from '../utils'

const map = new Map({
  mouseWheelZoom: true
})
// console.log(map)

map.singleShowPoint(coords => {
  // console.log(coords)
  const search = document.querySelector('.search__input')
  if (search) {
    axiosGet(
      `/api/search?q=${
        search.value
      }&lon=${coords[0].toString()}&lat=${coords[1].toString()}`,
      data => {
        if (data && data.items) {
          map.showEvents(data.items)
        }
      }
    )
  }
})

map.eventsOnClick(
  document.getElementById('popup'),
  onEventHTMLFn,
  onZoomMaxHTMLFn,
  userPosHTMLFn,
  coords => {
    // console.log(coords)
  }
)

function onEventHTMLFn (event) {
  // start date format
  let start = new Date(event.get('start'))
  start = `Le ${('0' + start.getDate()).slice(-2)}/${(
    '0' + start.getMonth()
  ).slice(-2)}/${start.getFullYear()} à ${('0' + start.getHours()).slice(
    -2
  )}:${('0' + start.getMinutes()).slice(-2)}`

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
