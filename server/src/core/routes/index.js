import path from 'path'
import userRoutes from './userRoutes'
import eventRoutes from './eventRoutes'
import groupRoutes from './groupRoutes'

export default server => {
  server.get('/', (req, res) => res.sendFile(path.resolve('.', 'client_build', 'index.html')))
  userRoutes(server)
  eventRoutes(server)
  groupRoutes(server)
}
