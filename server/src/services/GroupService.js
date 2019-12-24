import mongoose from 'mongoose'
import Service from './Service'

class GroupService extends Service {
  constructor(model) {
    super(model)
    this.model = model
  }

  readAll = (query, next, fallback) => {
    let { skip, limit, sort, uid, admin } = query

    skip = skip ? Number(skip) : 0
    limit = limit ? Number(limit) : 10
    sort = sort || '-createdAt'
    admin = Boolean(admin)

    delete query.skip
    delete query.limit
    delete query.sort
    delete query.uid
    delete query.admin

    if (query._id) {
      try {
        query._id = new mongoose.mongo.ObjectId(query._id)
      } catch (err) {
        return fallback(err)
      }
    }

    if (uid) {
      query.community = {
        $elemMatch: {
          $or: [
            { user: uid, role: 'admin' },
            { user: uid, role: 'member' }
          ]
        }
      }
      if (admin) query.community.$elemMatch = { user: uid, role: 'admin' }
    }

    this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .then(next)
      .catch(fallback)
  }

  update = (filter, update, next, fallback) => {
    this.model
      .findOneAndUpdate(filter, update, { new: true, runValidators: true })
      .then(data => {
        if (!data) return fallback({ message: 'not found', status: 404 })
        next(data)
      })
      .catch(fallback)
  }
}

export default GroupService
