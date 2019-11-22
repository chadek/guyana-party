import auth from '../middleware/auth'
import multer from '../middleware/multer-config'
import { catchErrors } from '../middleware/errorHandlers'
import userRoutes from './userRoutes'
import eventRoutes from './eventRoutes'
import groupRoutes from './groupRoutes'
import postController from '../../src/controllers/postController'

export default server => {
  userRoutes(server)
  eventRoutes(server)
  groupRoutes(server)

  // POST ROUTES
  server.get('/api/posts/', catchErrors(postController.readAll))
  server.get('/api/posts/:id', catchErrors(postController.read))
  server.post('/api/posts/', auth, multer, catchErrors(postController.create))
  server.put('/api/posts/:id', auth, multer, catchErrors(postController.update))
  server.delete('/api/posts/:id', auth, catchErrors(postController.delete))
}
