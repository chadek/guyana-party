import { B } from './bling'
import { getEvents } from './eventsOrgasList'

function manageOldNewButtons () {
  const btnOld = B('.btn-old')
  const btnNew = B('.btn-new')
  if (!btnOld || !btnNew) return

  btnOld.on('click', function () {
    this.classList.add('is-active')
    this.nextSibling.classList.remove('is-active')
    getEvents(B('#events'), null, 1, true)
  })

  btnNew.on('click', function () {
    this.classList.add('is-active')
    this.previousSibling.classList.remove('is-active')
    getEvents(B('#events'))
  })
}

function account () {
  const events = B('.account #events')
  const orgas = B('.account #orgas')
  if (!events || !orgas) return
  manageOldNewButtons()
}

export default account
