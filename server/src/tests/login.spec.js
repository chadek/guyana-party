// import supertest from 'supertest'
// import { mongoose } from '../core/database'
// import server, { api } from '../core/server'

// afterAll(done => mongoose.disconnect(done))

describe('todo: login.spec.js', () => {
  // TODO
  it('', () => {})
})
// describe('POST /auth/login', () => {
//   const request = supertest(server)
//   const route = `${api}/auth/login`
//   const email = 'test@mail.com'
//   const password = 'azer1234'

//   it('should NOT login without required `email` field', () =>
//     request
//       .post(route)
//       .send({ password })
//       .expect('Content-Type', /json/)
//       .expect(401, { status: 401, error: 'User not found' }))

//   it('should NOT login without required `password` field', () =>
//     request
//       .post(route)
//       .send({ email })
//       .expect('Content-Type', /json/)
//       .expect(401, {
//         status: 401,
//         error: 'User validation failed: password: Path `password` is required.'
//       }))

//   it('should NOT login with incorrect `email` field', () =>
//     request
//       .post(route)
//       .send({ email: 'bad@email.com', password })
//       .expect('Content-Type', /json/)
//       .expect(401, { status: 401, error: 'User not found' }))

//   it('should NOT login with incorrect `password` field', () =>
//     request
//       .post(route)
//       .send({ email, password: 'aWrongpassw0rd' })
//       .expect('Content-Type', /json/)
//       .expect(401, { status: 401, error: 'Incorrect password' }))

//   it('should login correctly', () =>
//     request
//       .post(route)
//       .send({ email, password })
//       .expect('Content-Type', /json/)
//       .expect(200)
//       .then(({ body }) => {
//         expect(body.status).toBe(200)
//         expect(body.user).toBeDefined()
//         expect(body.token).toBeDefined()
//       }))
// })
