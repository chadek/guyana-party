import mongoose from 'mongoose'
import Service from './Service'

class EventService extends Service {
  constructor (model) {
    super(model)
    this.model = model
  }

  search = async (query, next, fallback) => {
    const { skip, limit, sort, search, uid, box } = query

    let find = {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ],
      status: 'online',
      isPrivate: false,
      endDate: { $gte: Date.now() }
    }

    if (uid) {
      const Group = mongoose.model('Group')

      let adminGroups = await Group.find(
        { community: { $elemMatch: { user: uid, role: 'admin' } } },
        { id: true }
      )
      adminGroups = adminGroups.map(g => g.id)

      let memberGroups = await Group.find(
        { community: { $elemMatch: { user: uid, role: 'member' } } },
        { id: true }
      )
      memberGroups = memberGroups.map(g => g.id)

      find = {
        $or: [
          {
            name: { $regex: search, $options: 'i' },
            status: 'online',
            isPrivate: false
          },
          {
            description: { $regex: search, $options: 'i' },
            status: 'online',
            isPrivate: false
          },
          { group: { $in: adminGroups } },
          {
            group: { $in: memberGroups },
            status: 'online',
            isPrivate: true
          }
        ],
        endDate: { $gte: Date.now() }
      }
    }

    if (box) find.location = { $geoWithin: { $box: box } }

    this.model
      .find(find)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .then(next)
      .catch(fallback)
  }
}

export default EventService
