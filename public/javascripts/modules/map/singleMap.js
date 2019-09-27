import Map from './olMap'
import { axiosGet } from '../utils'

const lonElem = document.getElementById('longitude')
const latElem = document.getElementById('latitude')
const addressElem = document.getElementById('address')

const map = new Map({
  single: true,
  readOnly: !!document.querySelector('.readonly'),
  lon: lonElem ? lonElem.value : null,
  lat: latElem ? latElem.value : null
})

map.singleShowPoint((coords, showPoint) => {
  console.log("COORDS : ", coords)
  console.log("ShowPoint : ", showPoint)
  // les coordonnées sont la boite de la carte
  // Demander les coordonnées centrale
  if (showPoint) updateAddress(coords)
})

map.singleOnClick(coords => {
  updateAddress(coords)
})

// get Address from nominatim & update the value
function updateAddress (coords) {
  if (lonElem && latElem) {
    lonElem.value = coords[0]
    latElem.value = coords[1]
  }
  axiosGet(
    `https://nominatim.openstreetmap.org/reverse?format=json&lon=${coords[0].toString()}&lat=${coords[1].toString()}`,
    data => {
      if (addressElem) addressElem.value = data.display_name
    }
  )
}
