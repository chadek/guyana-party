import supertest from 'supertest'
import { mongoose } from '../config/database'
import server, { api } from '../config/server'

const request = supertest(server)
let auth = ''
let userId = ''
const route = `${api}/users`

beforeAll(() => {
  return request
    .post(`${api}/auth/login`)
    .send({ email: 'test@mail.com', password: 'azer1234' })
    .expect(200)
    .then(({ body }) => {
      auth = `bearer ${body.token}`
      userId = body.user._id
    })
})

afterAll(done => mongoose.disconnect(done))

describe('GET /users', () => {
  it('should get data correctly', () => {
    return request
      .get(route)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toBe(200)
        expect(body.total).toBeGreaterThanOrEqual(0)
        expect(body.data).toBeDefined()
      })
  })

  it('should get data by id params correctly', () => {
    return request
      .get(`${route}/${userId}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toBe(200)
        expect(body.data.valid).toBeDefined()
        expect(body.data._id).toBeDefined()
        expect(body.data.name).toBeDefined()
        expect(body.data.email).toBeDefined()
        expect(body.data.password).toBeUndefined()
        expect(body.data.createdAt).toBeDefined()
        expect(body.data.updatedAt).toBeDefined()
        expect(body.data.__v).toBeDefined()
      })
  })

  it('should return no data (by id params)', () => {
    return request
      .get(`${route}/5dd6d01613fcbb0aefd7c742`) // wrong
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(400, { status: 400 })
  })

  it('should NOT get data (by id params)', () => {
    return request
      .get(`${route}/5dd6d01613fcbb0aefd7c742a`) // incorrect format
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(({ body }) => {
        expect(body.status).toBe(400)
        expect(body.error).toBeDefined()
      })
  })

  it('should get data by `_id` query correctly', () => {
    return request
      .get(`${route}?_id=${userId}`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toBe(200)
        expect(body.total).toBe(1)
        expect(body.data).toHaveLength(1)
        const data = body.data[0]
        expect(data.valid).toBeDefined()
        expect(data._id).toBeDefined()
        expect(data.name).toBeDefined()
        expect(data.email).toBeDefined()
        expect(data.password).toBeUndefined()
        expect(data.createdAt).toBeDefined()
        expect(data.updatedAt).toBeDefined()
        expect(data.__v).toBeDefined()
      })
  })

  it('should return an empty data array (by `_id` query)', () => {
    return request
      .get(route + '?_id=5dd5f4092551f17f2877760a')
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200, { status: 200, total: 0, data: [] })
  })

  it('should NOT get data (by `_id` query)', () => {
    return request
      .get(`${route}?_id=5dd6d01613fcbb0aefd7c742a`) // incorrect format
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(({ body }) => expect(body.status).toBe(400))
  })

  it('should get one item (by `limit` filter)', () => {
    return request
      .get(`${route}?limit=1`)
      .set('Authorization', auth)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(({ body }) => {
        expect(body.status).toBe(200)
        expect(body.total).toBe(1)
        expect(body.data).toHaveLength(1)
      })
  })
})
