import { B } from "./bling";
import { axiosGet } from "./utils";
import dompurify from "dompurify";

function geolocate() {
  navigator.geolocation.getCurrentPosition(pos => {
    // get town and postcode form nominatim
    axiosGet(
      `http://nominatim.openstreetmap.org/reverse?format=json&lon=${pos.coords.longitude}&lat=${pos.coords.latitude}`,
      data => {
        const text = dompurify.sanitize(
          `Autour de <strong style='color:#527fdc;'>${data.address.town} ${data.address.postcode}</strong>`
        );
        B("#around-label").innerHTML = text;
        B("#around-value").value = JSON.stringify({
          text: text,
          lon: pos.coords.longitude,
          lat: pos.coords.latitude,
          location: `${data.address.town} ${data.address.postcode}`
        });
      }
    );
  });
}

export default geolocate;
