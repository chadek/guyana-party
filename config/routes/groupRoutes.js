import auth from '../middleware/auth'
import { catchErrors } from '../middleware/errorHandlers'
import multer from '../middleware/multer-config'
import { api } from '../env'
import groupController from '../../src/controllers/groupController'

export default server => {
  server.get(`${api}/groups/`, catchErrors(groupController.readAll))
  server.get(`${api}/groups/:id`, catchErrors(groupController.read))
  server.post(
    `${api}/groups/`,
    auth,
    multer,
    catchErrors(groupController.create)
  )
  server.put(
    `${api}/groups/:id`,
    auth,
    multer,
    catchErrors(groupController.update)
  )
  server.delete(`${api}/groups/:id`, auth, catchErrors(groupController.delete))
}
