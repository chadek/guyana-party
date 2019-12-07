import Controller from './Controller'
import EventService from '../services/EventService'
import Event from '../models/Event'

class EventController extends Controller {
  constructor(service) {
    super(service)
    this.service = service
  }

  search = async (req, res, next) => {
    const query = {
      skip: req.queryInt('skip') || 0,
      limit: req.queryInt('limit') || 10,
      sort: req.queryString('sort') || '-createdAt',
      search: req.queryString('q') || '',
      uid: req.queryString('uid') || '',
      sw1: req.queryFloat('sw1'),
      sw2: req.queryFloat('sw2'),
      ne1: req.queryFloat('ne1'),
      ne2: req.queryFloat('ne2')
    }

    const { sw1, sw2, ne1, ne2 } = query
    if (sw1 && sw2 && ne1 && ne2) {
      query.box = [
        [sw1, sw2],
        [ne1, ne2]
      ]
    }

    this.service.search(
      query,
      data => res.json(this.format({ data, total: data.length })),
      err => next({ ...err, status: 400 })
    )
  }
}

const eventService = new EventService(new Event().getInstance())

export default new EventController(eventService)
