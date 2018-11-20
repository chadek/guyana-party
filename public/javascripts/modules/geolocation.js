import dompurify from 'dompurify'
import { b } from './bling'
import { axiosGet } from './utils'

function geolocate () {
  navigator.geolocation.getCurrentPosition(pos => {
    console.log(pos)
    // get town and postcode form nominatim
    axiosGet(
      `https://nominatim.openstreetmap.org/reverse?format=json&lon=${
        pos.coords.longitude
      }&lat=${pos.coords.latitude}`,
      data => {
        const text = dompurify.sanitize(
          `Trouver les évènements autour de <strong style='color:#527fdc;'>${
            data.address.town
          }</strong>`
        )
        b('#around-click').innerHTML = text
        b('#around-value').value = JSON.stringify({
          text: text,
          lon: pos.coords.longitude,
          lat: pos.coords.latitude,
          location: `${data.address.town} ${data.address.postcode}`
        })
      }
    )
  })
}

function autourdemoi () {
  navigator.geolocation.getCurrentPosition(pos => {
    console.log(pos)
    // get town and postcode form nominatim
    axiosGet(
      `https://nominatim.openstreetmap.org/reverse?format=json&lon=${
        pos.coords.longitude
      }&lat=${pos.coords.latitude}`,
      data => {
        b('#around-value').value = JSON.stringify({
          lon: pos.coords.longitude,
          lat: pos.coords.latitude,
          location: `${data.address.town} ${data.address.postcode}`
        })
        window.location = '/events'
      }
    )
  })
}

export { geolocate, autourdemoi }
