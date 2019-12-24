import { api } from '../env'
import auth from '../middleware/auth'
import upload from '../middleware/upload'
import { catchErrors } from '../middleware/errorHandlers'
import eventController from '../../controllers/eventController'

export default server => {
  server.get(`${api}/search`, catchErrors(eventController.search))
  server.get(`${api}/events`, catchErrors(eventController.readAll))
  server.get(`${api}/events/:id`, catchErrors(eventController.read))
  server.post(`${api}/events`, auth, upload, catchErrors(eventController.create))
  server.put(`${api}/events/:id`, auth, upload, catchErrors(eventController.update))
  server.delete(`${api}/events/:id`, auth, catchErrors(eventController.delete))
}
