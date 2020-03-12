import './core/database'
import server, { port } from './core/server'

server.listen(port, () => {
  console.log(`Server running → http://localhost:${port}`)
})
