import auth from '../middleware/auth'
import { catchErrors } from '../middleware/errorHandlers'
import multer from '../middleware/multer-config'
import { api } from '../env'
import eventController from '../../src/controllers/eventController'

export default server => {
  server.get(`${api}/events/`, catchErrors(eventController.readAll))
  server.get(`${api}/events/:id`, catchErrors(eventController.read))
  server.post(
    `${api}/events/`,
    auth,
    multer,
    catchErrors(eventController.create)
  )
  server.put(
    `${api}/events/:id`,
    auth,
    multer,
    catchErrors(eventController.update)
  )
  server.delete(`${api}/events/:id`, auth, catchErrors(eventController.delete))
}
