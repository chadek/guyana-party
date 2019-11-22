import Controller from './Controller'
import EventService from '../services/EventService'
import Event from '../models/Event'

class EventController extends Controller {
  constructor (service) {
    super(service)
    this.service = service
  }
}

const eventService = new EventService(new Event().getInstance())

export default new EventController(eventService)
