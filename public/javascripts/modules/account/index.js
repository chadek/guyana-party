import { B } from '../bling'
import getEvents from './eventsList'
import getGroups from './groupsList'

function manageOldNewButtons (eventsDiv, groupsDiv) {
  const btnOld = B('.btn-old')
  const btnNew = B('.btn-new')
  if (!btnOld || !btnNew) return

  btnOld.on('click', function () {
    this.classList.add('is-active')
    this.nextSibling.classList.remove('is-active')
    getEvents(eventsDiv, null, 1, true)
  })

  btnNew.on('click', function () {
    this.classList.add('is-active')
    this.previousSibling.classList.remove('is-active')
    getEvents(eventsDiv)
  })
}

;(() => {
  const eventsDiv = B('.account #events')
  const groupsDiv = B('.account #groups')
  if (!eventsDiv || !groupsDiv) return
  getEvents(eventsDiv)
  getGroups(groupsDiv)
  manageOldNewButtons(eventsDiv, groupsDiv)
})()
