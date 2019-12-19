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
    const success = ({ user, token }) => {
      res.status(200).json(this.format({ custom: { user, token } }))
    }
    const fallback = err => next({ ...err, status: 401 })

    const { provider } = req.body
    if (!provider) {
      this.service.login(req.body, success, fallback)
    } else {
      const capProvider = provider.charAt(0).toUpperCase() + provider.slice(1)
      this.service[`login${capProvider}`](req.body, success, fallback)
    }
  }
}

const userService = new UserService(new User().getInstance())

export default new UserController(userService)
