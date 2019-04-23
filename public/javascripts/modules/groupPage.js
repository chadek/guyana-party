import { b } from './bling'
import getEvents from './account/eventsList'

const orgaId = b('#orga-id')

// Get events
;(() => {
  const eventsDiv = b('.orga-events#events')
  if (!eventsDiv || !orgaId) return
  getEvents(eventsDiv, orgaId)
})()
// Add a user request
;(() => {
  const userReqBtn = b('#userRequest')
  if (userReqBtn && orgaId && orgaId.value) {
    userReqBtn.on('click', () => {
      window.location = `/organism/${orgaId.value}/community/add`
    })
  }
})()
