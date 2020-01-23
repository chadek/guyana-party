// import supertest from 'supertest'
// import { mongoose } from '../core/database'
// import server, { api } from '../core/server'

// const request = supertest(server)
// const route = `${api}/auth/signup`
// const name = 'Chris'
// const email = 'signup@mail.com'
// const password = 'azer1234'

// afterAll(done =>
//   request
//     .post(`${api}/auth/login`)
//     .send({ email, password })
//     .expect(200)
//     .then(({ body }) =>
//       request
//         .delete(`${api}/users/${body.user._id}`)
//         .set('Authorization', `bearer ${body.token}`)
//         .expect(200)
//     )
//     .finally(() => mongoose.disconnect(done))
// )

describe('todo: signup.spec.js', () => {
  // TODO
  it('', () => {})
})
// describe('POST /auth/signup', () => {
//   it('should NOT signup without required `name` field', () =>
//     request
//       .post(route)
//       .send({ email, password })
//       .expect('Content-Type', /json/)
//       .expect(500, {
//         status: 500,
//         error: 'User validation failed: name: Path `name` is required.'
//       }))

//   it('should NOT signup without required `email` field', () =>
//     request
//       .post(route)
//       .send({ name, password })
//       .expect('Content-Type', /json/)
//       .expect(500, {
//         status: 500,
//         error: 'User validation failed: email: Path `email` is required.'
//       }))

//   it('should NOT signup without required `password` field', () =>
//     request
//       .post(route)
//       .send({ name, email })
//       .expect('Content-Type', /json/)
//       .expect(500, {
//         status: 500,
//         error: 'User validation failed: password: Path `password` is required.'
//       }))

//   it('should NOT signup with incorrect `email` field', () =>
//     request
//       .post(route)
//       .send({ name, email: 'tmpmail.com', password })
//       .expect('Content-Type', /json/)
//       .expect(500, {
//         status: 500,
//         error: 'User validation failed: email: Email invalide'
//       }))

//   it('should signup correctly', () =>
//     request
//       .post(route)
//       .send({ name, email, password })
//       .expect('Content-Type', /json/)
//       .expect(201, { status: 201, message: 'Ok' }))

//   it('should NOT signup with identical email', () =>
//     request
//       .post(route)
//       .send({ name, email, password })
//       .expect('Content-Type', /json/)
//       .expect(500, {
//         status: 500,
//         error: 'User validation failed: email: Error, expected `email` to be unique. Value: `signup@mail.com`'
//       }))
// })
