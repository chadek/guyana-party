import '../sass/style.scss'
import { b, bb } from './modules/bling'
import './modules/account'
import './modules/eventPage'
import './modules/groupPage'
import addEventForm from './modules/addEventForm'
import checkName from './modules/checkForm'
import initDates from './modules/date'

// Signup form - check the availability of the name
checkName(bb('input'), b('input#name'), b('#name-error'), b('#action-btn'))

// open popup on click on avatar nav
const menuItemAvatar = b('.menu-item-avatar')
if (menuItemAvatar) {
  menuItemAvatar.on('click', () => {
    const popOver = b('.pop-over')
    popOver.classList.toggle('pop-over--visible')
    b('.pop-over-header-close-btn').on('click', () => {
      popOver.classList.remove('pop-over--visible')
    })
  })
}

// managing file uploads when needed
const fileUpload = b('#fileUpload')
if (fileUpload) {
  fileUpload.on('change', function (e) {
    const evt = e || window.event
    fileUpload.nextSibling.textContent = `Fichier : ${
      (evt.target || evt.srcElement).files[0].name
    }`
  })
}

initDates(b('#event-start'), b('#event-end'))
addEventForm(b('#dp1'), b('#dp2'), b('.switch-publish-event'))
