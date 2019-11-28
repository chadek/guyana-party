import Controller from './Controller'
import UserService from '../services/UserService'
import User from '../models/User'

class UserController extends Controller {
  constructor (service) {
    super(service)
    this.service = service
  }

  signup = async (req, res, next) => {
    this.service.signup(
      req.body,
      () => res.status(201).json(this.format({ message: 'Ok', status: 201 })),
      next
    )
  }

  login = async (req, res, next) => {
    this.service.login(
      req.body,
      ({ user, token }) => {
        res.status(200).json(this.format({ custom: { user, token } }))
      },
      err => next({ ...err, status: 401 })
    )
  }

  tokensignin = async (req, res, next) => {
    this.service.tokensignin(
      req.body,
      ({ user, token }) => {
        res.status(200).json(this.format({ custom: { user, token } }))
      },
      err => next({ ...err, status: 401 })
    )
  }
}

const userService = new UserService(new User().getInstance())

export default new UserController(userService)
