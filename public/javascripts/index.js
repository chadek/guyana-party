import '../sass/style.scss'
import accountForm from './modules/accountForm'
import addEventForm from './modules/addEventForm'
import { B, BB } from './modules/bling'
import { checkName } from './modules/checkForm'
import initDates from './modules/date'
import loadEventsOrgasList from './modules/eventsOrgasList'
import './modules/map'
import './modules/simplemde'
// import "./modules/menu";
// import subscriptions from './modules/subscriptions'

// Signup form - check the availability of the name
checkName(BB('input'), B('input#name'), B('#name-error'), B('#action-btn'))

// open popup on click on avatar nav
B('.menu-item-avatar') &&
  B('.menu-item-avatar').on('click', () => {
    const popOver = B('.pop-over')
    popOver.classList.toggle('pop-over--visible')
    B('.pop-over-header-close-btn').on('click', () => {
      popOver.classList.remove('pop-over--visible')
    })
  })

// managing file uploads when needed
B('#fileUpload') &&
  B('#fileUpload').on('change', function (e) {
    const evt = e || window.event
    this.nextSibling.textContent = `Fichier : ${
      (evt.target || evt.srcElement).files[0].name
    }`
  })

// geolocation for home and events pages
// const aroundCheck = B("#around-check");
// if (aroundCheck) {
//   if (aroundCheck.checked) {
//     B("#around-label").innerHTML = "<strong>Localisation en cours...</strong>";
//     geolocate();
//   }
//   aroundCheck.on("click", function() {
//     if (this.checked) {
//       B("#around-label").innerHTML = "<strong>Localisation en cours...</strong>";
//       geolocate();
//     } else {
//       B("#around-label").innerHTML = "Autour de moi";
//       B("#around-value").value = "";
//     }
//   });
// }

B('#around-click') &&
  B('#around-click').on('click', () => {
    window.location = '/events'
  })

accountForm(B('.btn-old'), B('.btn-new'))
// subscriptions(B('.freeSubsBtn'), B('.assoSubsBtn'))

loadEventsOrgasList(
  B('.events'),
  B('.orga-events'),
  B('.orgas'),
  B('#orga-select')
)
initDates(B('#event-start'), B('#event-end'))
addEventForm(B('#dp1'), B('#dp2'), B('.switch-publish-event'))
