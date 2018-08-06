import Map from './olMap'

let lon = document.querySelector('#longitude')
let lat = document.querySelector('#latitude')

const map = new Map({
  single: true,
  readOnly: !!document.querySelector('.readonly'),
  mouseWheelZoom: false,
  lon: lon ? lon.value : null,
  lat: lat ? lat.value : null
})

map.singleShowPoint()

map.singleOnClick((coord, address) => {
  console.log(coord, address)
})

console.log(map)
