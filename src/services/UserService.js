import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import Service from './Service'
import { googleClientId, secret } from '../core/env'
import { logInfo } from '../core/logger'

class UserService extends Service {
  constructor(model) {
    super(model)
    this.model = model
  }

  update = async (id, body, next, fallback) => {
    try {
      if (body.photos.length > 0) body.photo = body.photos[0]
      this.model
        .findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' })
        .then(data => {
          if (!data) return fallback({ message: 'not found', status: 404 })
          next(data)
        })
        .catch(fallback)
    } catch (error) {
      fallback(error)
    }
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
      return this.model
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
      logInfo(`Login: ${email}`)
      const user = await this.model.findOne({ email })
      if (!user) {
        return fallback({ message: `User not found` })
      }
      if (!password) {
        return fallback({
          message: 'User validation failed: password: Path `password` is required.'
        })
      }
      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return fallback({ message: `Incorrect password` })

      const userObj = user.toObject()
      delete userObj.password
      next({ user: userObj, token: sign(user._id) })
    } catch {
      fallback({ message: `Unauthorized user` })
    }
  }

  loginFacebook = async (body, next, fallback) => {
    try {
      const { name, email, provider } = body
      logInfo(`Login: ${email} Provider: ${provider}`)
      const user = await this.model.findOne({ email })
      if (user) {
        return next({ user, token: sign(user._id) })
      } else {
        this.model
          .create({ email, name, provider, valid: true })
          .then(data => next({ user: data, token: sign(data._id) }))
          .catch(fallback)
      }
    } catch (error) {
      fallback(error)
    }
  }

  loginGoogle = async (body, next, fallback) => {
    try {
      const { tokenId, provider } = body
      if (tokenId && provider) {
        const client = new OAuth2Client(googleClientId)
        const ticket = await client.verifyIdToken({
          idToken: tokenId,
          audience: googleClientId // if multiple clients access the backend: [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        })
        const { email, name } = ticket.getPayload()
        logInfo(`Login: ${email} Provider: ${provider}`)
        const user = await this.model.findOne({ email })
        if (user) {
          return next({ user, token: sign(user._id) })
        } else {
          this.model
            .create({ email, name, provider, valid: true })
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
