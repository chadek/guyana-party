import auth from '../middleware/auth'
import { catchErrors } from '../middleware/errorHandlers'
import { api } from '../env'
import userController from '../../src/controllers/userController'

export default server => {
  server.get(`${api}/users/`, auth, catchErrors(userController.readAll))
  server.get(`${api}/users/:id`, auth, catchErrors(userController.read))
  server.put(`${api}/users/:id`, auth, catchErrors(userController.update))
  server.delete(`${api}/users/:id`, auth, catchErrors(userController.delete))
  server.post(`${api}/auth/signup`, catchErrors(userController.signup))
  server.post(`${api}/auth/login`, catchErrors(userController.login))
}
