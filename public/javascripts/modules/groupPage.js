import { b } from './bling'
import getEvents from './account/eventsList'

function loadEvents () {
  const eventsDiv = b('.orga-events#events')
  const orgaId = b('#orga-id')
  if (!eventsDiv || !orgaId) return
  getEvents(eventsDiv, orgaId)
}

loadEvents()
