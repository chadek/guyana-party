import Controller from './Controller'
import GroupService from '../services/GroupService'
import Group from '../models/Group'

class GroupController extends Controller {
  constructor (service) {
    super(service)
    this.service = service
  }

  create = async (req, res, next) => {
    req.body.community = [{ user: req.body.author, role: 'admin' }]
    this.service.create(
      req.body,
      data => res.status(201).json(this.format({ data, status: 201 })),
      err => next({ ...err, status: 400 })
    )
  }

  update = async (req, res, next) => {
    this.service.update(
      req.params.id ? { _id: req.params.id } : req.body.filter,
      req.params.id ? req.body : req.body.update,
      data => res.status(200).json(this.format({ data })),
      err => next({ ...err, status: err.status || 400 })
    )
  }
}

const groupService = new GroupService(new Group().getInstance())

export default new GroupController(groupService)
