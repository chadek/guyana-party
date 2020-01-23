import supertest from 'supertest'
import { mongoose } from '../core/database'
import server, { api } from '../core/server'

const request = supertest(server)
const route = `${api}/events`

afterAll(done => mongoose.disconnect(done))

describe('GET /events', () => {
  it('should get data correctly', () =>
    request
      .get(route)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toBe(200)
        expect(body.total).toBeGreaterThanOrEqual(0)
        expect(body.data).toBeDefined()
      }))
})
