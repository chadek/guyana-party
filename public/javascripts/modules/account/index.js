import { b } from '../bling'
import getEvents from './eventsList'
import getGroups from './groupsList'

function manageOldNewButtons (eventsDiv, groupsDiv) {
  const btnOld = b('.btn-old')
  const btnNew = b('.btn-new')
  if (!btnOld || !btnNew) return

  btnOld.on('click', function () {
    btnOld.classList.add('is-active')
    btnOld.nextSibling.classList.remove('is-active')
    getEvents(eventsDiv, null, 1, true)
  })

  btnNew.on('click', function () {
    btnNew.classList.add('is-active')
    btnNew.previousSibling.classList.remove('is-active')
    getEvents(eventsDiv)
  })
}

(() => {
  const eventsDiv = b('.account #events')
  const groupsDiv = b('.account #groups')
  if (!eventsDiv || !groupsDiv) return
  getEvents(eventsDiv)
  getGroups(groupsDiv)
  manageOldNewButtons(eventsDiv, groupsDiv)
})()
