import auth from '../middleware/auth'
import { catchErrors } from '../middleware/errorHandlers'
import upload from '../middleware/upload'
import { api } from '../env'
import groupController from '../../controllers/groupController'

export default server => {
  server.get(`${api}/groups`, catchErrors(groupController.readAll))
  server.get(`${api}/groups/:id`, catchErrors(groupController.read))
  server.post(`${api}/groups`, auth, upload, catchErrors(groupController.create))
  server.put(`${api}/groups`, auth, upload, catchErrors(groupController.update))
  server.put(`${api}/groups/:id`, auth, upload, catchErrors(groupController.update))
  server.delete(`${api}/groups/:id`, auth, catchErrors(groupController.delete))
}
