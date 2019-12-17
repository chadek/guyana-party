import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import Service from './Service'
import { googleClientId, secret } from '../config/env'

class UserService extends Service {
  constructor(model) {
    super(model)
    this.model = model
  }

  signup = async (body, next, fallback) => {
    try {
      const { name, email, password } = body
      if (!password) {
        return fallback({
          message: 'User validation failed: password: Path `password` is required.'
        })
      }
      const hash = await bcrypt.hash(password, 10)
      this.model
        .create({ name, email, password: hash })
        .then(next)
        .catch(fallback)
    } catch (error) {
      fallback(error)
    }
  }

  login = async (body, next, fallback) => {
    try {
      const { email, password } = body
      const user = await this.model.findOne({ email })
      if (!user) {
        return fallback({ message: 'User not found' })
      }
      if (!password) {
        return fallback({
          message: 'User validation failed: password: Path `password` is required.'
        })
      }
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return fallback({ message: 'Incorrect password' })

      const userObj = user.toObject()
      delete userObj.password
      next({ user: userObj, token: sign(user._id) })
    } catch (error) {
      fallback(error)
    }
  }

  tokensignin = async (body, next, fallback) => {
    try {
      const { tokenId, provider } = body
      if (tokenId && provider) {
        const client = new OAuth2Client(googleClientId)
        const ticket = await client.verifyIdToken({
          idToken: tokenId,
          audience: googleClientId // if multiple clients access the backend: [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        })
        const { email, name, picture: photo } = ticket.getPayload()
        const user = await this.model.findOne({ email })
        if (user) {
          return next({ user, token: sign(user._id) })
        } else {
          this.model
            .create({ email, name, photo, provider, valid: true })
            .then(data => next({ user: data, token: sign(data._id) }))
            .catch(fallback)
        }
      } else fallback({ message: 'Error: token id and provider are required.' })
    } catch (error) {
      fallback(error)
    }
  }
}

const sign = userId => jwt.sign({ userId }, secret, { expiresIn: '24h' })

export default UserService
