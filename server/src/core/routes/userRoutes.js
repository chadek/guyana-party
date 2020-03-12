import { api } from '../env'
import auth from '../middleware/auth'
import upload from '../middleware/upload'
import { catchErrors } from '../middleware/errorHandlers'
import userController from '../../controllers/userController'

export default server => {
  server.get(`${api}/users`, auth, catchErrors(userController.readAll))
  server.get(`${api}/users/:id`, auth, catchErrors(userController.read))
  server.put(`${api}/users/:id`, auth, upload, catchErrors(userController.update))
  server.delete(`${api}/users/:id`, auth, catchErrors(userController.delete))
  server.post(`${api}/auth/login`, catchErrors(userController.login))
  server.post(`${api}/auth/sendmail`, catchErrors(userController.sendEmail))
  server.post(`${api}/auth/loginmail`, catchErrors(userController.loginEmail))
}
