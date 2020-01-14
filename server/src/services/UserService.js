// import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import crypto from 'crypto'
import Service from './Service'
import { googleClientId, secret } from '../core/env'
import { logInfo } from '../core/logger'
import { sendMail } from '../core/mail'

class UserService extends Service {
  constructor(model) {
    super(model)
    this.model = model
  }

  update = async (id, body, next, fallback) => {
    try {
      if (body.photos && body.photos.length > 0) body.photo = body.photos[0]
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

  // signup = async (body, next, fallback) => {
  //   try {
  //     const { name, email, password } = body
  //     if (!password) {
  //       return fallback({
  //         message: 'User validation failed: password: Path `password` is required.'
  //       })
  //     }
  //     const hash = await bcrypt.hash(password, 10)
  //     return this.model
  //       .create({ name, email, password: hash })
  //       .then(next)
  //       .catch(fallback)
  //   } catch (error) {
  //     fallback(error)
  //   }
  // }

  // login = async (body, next, fallback) => {
  //   try {
  //     const { email, password } = body
  //     logInfo(`Login: ${email}`)
  //     const user = await this.model.findOne({ email })
  //     if (!user) {
  //       return fallback({ message: `User not found` })
  //     }
  //     if (!password) {
  //       return fallback({
  //         message: 'User validation failed: password: Path `password` is required.'
  //       })
  //     }
  //     const valid = await bcrypt.compare(password, user.password)
  //     if (!valid) return fallback({ message: `Incorrect password` })

  //     const userObj = user.toObject()
  //     delete userObj.password
  //     next({ user: userObj, token: sign(user._id) })
  //   } catch {
  //     fallback({ message: `Unauthorized user` })
  //   }
  // }

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

  sendEmail = async ({ email, linkHost }, next, fallback) => {
    let user = await this.model.findOne({ email })

    const authLinkToken = crypto.randomBytes(20).toString('hex')
    const authLinkExpires = Date.now() + 3600000 // 1 hour from now

    if (user) {
      if (user.provider) return next(user.provider)
      user.authLinkToken = authLinkToken
      user.authLinkExpires = authLinkExpires
      await user.save()
    } else {
      user = await this.model.create({
        email,
        name: 'Veuillez modifier votre nom',
        authLinkToken,
        authLinkExpires
      })
    }

    const linkURL = `${linkHost}/${authLinkToken}`
    await sendMail({
      to: user.email,
      subject: 'Connectez-vous à Guyana-Party',
      html: `<p>Bonjour</p><p>Nous avons reçu une demande de connexion à <i>Guyana-Party</i> depuis cette adresse e-mail. Si vous voulez vous connecter avec votre compte <a href="mailto:${email}" target="_blank" rel="noopener noreferrer">${email}</a>, cliquez sur le lien suivant :</p><p><a href="${linkURL}" target="_blank" rel="noopener noreferrer">Se connecter à Guyana-Party</a></p><p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.</p><p>Merci,</p><p>Votre équipe <i>Guyana-Party</i></p>`
    })
    next()
  }

  loginEmail = async (authLinkToken, next, fallback) => {
    const user = await this.model.findOne({ authLinkToken })
    if (user) {
      if (new Date() > new Date(user.authLinkExpires))
        return fallback({ message: `Token has expired.` })
      user.valid = true
      user.authLinkToken = null
      user.authLinkExpires = null
      await user.save()
      next({ user, token: sign(user._id) })
    } else {
      fallback({ message: `Unauthorized token ${authLinkToken}.` })
    }
  }
}

const sign = userId => jwt.sign({ userId }, secret, { expiresIn: '24h' })

export default UserService
