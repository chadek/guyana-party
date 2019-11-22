import Controller from './Controller'
import GroupService from '../services/GroupService'
import Group from '../models/Group'

class GroupController extends Controller {
  constructor (service) {
    super(service)
    this.service = service
  }
}

const groupService = new GroupService(new Group().getInstance())

export default new GroupController(groupService)
