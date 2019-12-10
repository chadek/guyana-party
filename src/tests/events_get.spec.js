import supertest from 'supertest'
import { mongoose } from '../config/database'
import server, { api } from '../config/server'

const request = supertest(server)
const route = `${api}/events`

afterAll(done => mongoose.disconnect(done))

describe('GET /events', () => {
  it('should get data correctly', () => {
    return request
      .get(route)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toBe(200)
        expect(body.total).toBeGreaterThanOrEqual(0)
        expect(body.data).toBeDefined()
      })
  })
})
