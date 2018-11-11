import { B } from './bling'
import getEvents from './account/eventsList'

function loadEvents () {
  const eventsDiv = B('.orga-events')
  const orgaId = B('#orga-id')
  if (!eventsDiv || !orgaId) return
  getEvents(eventsDiv, orgaId)
}

loadEvents()
