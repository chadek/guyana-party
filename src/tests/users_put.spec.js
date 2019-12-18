import supertest from 'supertest'
import { mongoose } from '../core/database'
import server, { api } from '../core/server'

const request = supertest(server)
let auth = ''
let userId = ''
const route = `${api}/users`
const name = 'Chris'
const email = 'users_put@mail.com'
const password = 'azer1234'

beforeAll(() => {
  return request
    .post(`${api}/auth/signup`)
    .send({ name, email, password })
    .expect('Content-Type', /json/)
    .expect(201, { status: 201, message: 'Ok' })
    .then(() => {
      return request
        .post(`${api}/auth/login`)
        .send({ email, password })
        .expect(200)
        .then(({ body }) => {
          auth = `bearer ${body.token}`
          userId = body.user._id
        })
    })
})

afterAll(done => {
  return request
    .delete(`${route}/${userId}`)
    .set('Authorization', auth)
    .expect(200)
    .then()
    .finally(() => mongoose.disconnect(done))
})

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
