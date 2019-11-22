import './config/database'
import server, { port } from './config/server'

server.listen(port, () => {
  console.log(`Server running → http://localhost:${port}`)
})
