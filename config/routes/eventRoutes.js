import auth from '../middleware/auth'
import { catchErrors } from '../middleware/errorHandlers'
import upload from '../middleware/upload'
import { api } from '../env'
import eventController from '../../src/controllers/eventController'

export default server => {
  server.get(`${api}/events/`, catchErrors(eventController.readAll))
  server.get(`${api}/events/:id`, catchErrors(eventController.read))
  server.post(
    `${api}/events/`,
    auth,
    upload,
    catchErrors(eventController.create)
  )
  server.put(
    `${api}/events/:id`,
    auth,
    upload,
    catchErrors(eventController.update)
  )
  server.delete(`${api}/events/:id`, auth, catchErrors(eventController.delete))
}
