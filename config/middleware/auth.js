import jwt from 'jsonwebtoken'
import env from '../env'

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, env.secret)
    if (req.body.userId && req.body.userId !== decodedToken.userId) {
      const error = new Error('Invalid user ID')
      error.status = 401
      throw error
    }
    next()
  } catch {
    const error = new Error('Invalid request!')
    error.status = 401
    throw error
  }
}
