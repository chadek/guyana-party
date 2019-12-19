import supertest from 'supertest'
import { mongoose } from '../core/database'
import server, { api } from '../core/server'

const request = supertest(server)
let auth = ''
let userId = ''
const route = `${api}/users`

beforeAll(() => {
  return request
    .post(`${api}/auth/login`)
    .send({ email: 'users_put@mail.com', password: 'azer1234' })
    .expect(200)
    .then(({ body }) => {
      auth = `bearer ${body.token}`
      userId = body.user._id
    })
})

afterAll(done => mongoose.disconnect(done))

describe('PUT /users/:id', () => {
  it('should update user name correctly', () => {
    return request
      .put(`${route}/${userId}`)
      .set('Authorization', auth)
      .send({ name: 'TOTO' })
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toBe(200)
        expect(body.data.name).toBe('TOTO')
      })
  })
})
