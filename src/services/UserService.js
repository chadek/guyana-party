import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import Service from './Service'
import { googleClientId, secret } from '../../config/env'

class UserService extends Service {
  constructor(model) {
    super(model)
    this.model = model
  }

  signup = async (body, next, fallback) => {
    const { name, email, password } = body
    if (!password) {
      return fallback({
        message:
          'User validation failed: password: Path `password` is required.'
      })
    }
    const hash = await bcrypt.hash(password, 10)
    this.model
      .create({ name, email, password: hash })
      .then(next)
      .catch(fallback)
  }

  login = async (body, next, fallback) => {
    const { email, password } = body

    const user = await this.model.findOne({ email })
    if (!user) return fallback({ message: 'User not found' })

    if (!password) {
      return fallback({
        message:
          'User validation failed: password: Path `password` is required.'
      })
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) return fallback({ message: 'Incorrect password' })

    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: '24h' })
    next({ userId: user._id, token })
  }

  tokensignin = async (body, next, fallback) => {
    const { tokenId, provider } = body
    if (tokenId && provider) {
      const client = new OAuth2Client(googleClientId)
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: googleClientId // if multiple clients access the backend: [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
      })
      const { email, name, picture: photo } = ticket.getPayload()
      const user = await this.model.findOne({ email })
      let token
      if (user) {
        token = jwt.sign({ userId: user._id }, secret, { expiresIn: '24h' })
        return next({ userId: user._id, token })
      } else {
        this.model
          .create({ email, name, photo, provider })
          .then(({ _id: userId }) => {
            token = jwt.sign({ userId }, secret, { expiresIn: '24h' })
            next({ userId, token })
          })
          .catch(fallback)
      }
    } else fallback({ message: 'Error: token id and provider are required.' })
  }
}

export default UserService
