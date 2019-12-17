import Controller from './Controller'
import UserService from '../services/UserService'
import User from '../models/User'

class UserController extends Controller {
  constructor(service) {
    super(service)
    this.service = service
  }

  readAll = async (req, res, next) => {
    this.service.readAll(
      req.query,
      users => {
        const newUsers = users.map(u => {
          const userObj = u.toObject()
          delete userObj.password
          return userObj
        })
        res.json(this.format({ data: newUsers, total: newUsers.length }))
      },
      err => next({ ...err, status: 400 })
    )
  }

  read = async (req, res, next) => {
    this.service.read(
      req.params.id,
      user => {
        const data = user.toObject()
        delete data.password
        res.json(this.format({ data }))
      },
      err => next({ ...err, status: 400 })
    )
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
