import userRoutes from './userRoutes'
import eventRoutes from './eventRoutes'
import groupRoutes from './groupRoutes'

export default server => {
  userRoutes(server)
  eventRoutes(server)
  groupRoutes(server)
}
