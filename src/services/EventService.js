import Service from './Service'

class EventService extends Service {
  constructor (model) {
    super(model)
    this.model = model
  }
}

export default EventService
