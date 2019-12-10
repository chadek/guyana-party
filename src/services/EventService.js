import mongoose from 'mongoose'
import Service from './Service'

class EventService extends Service {
  constructor (model) {
    super(model)
    this.model = model
  }

  search = async (query, next, fallback) => {
    const { skip, limit, sort, search, uid, box } = query
    let find = {}

    const searchQuery = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'igm' } }
    ]

    if (uid) {
      const Group = mongoose.model('Group')

      const adminGroups = await Group.find(
        { community: { $elemMatch: { user: uid, role: 'admin' } } },
        { id: true }
      )

      const memberGroups = await Group.find(
        { community: { $elemMatch: { user: uid, role: 'member' } } },
        { id: true }
      )

      find = {
        $or: [
          {
            $or: searchQuery,
            status: 'online',
            isPrivate: false
          },
          {
            group: { $in: adminGroups.map(g => g.id) },
            $or: searchQuery,
            status: { $in: ['waiting', 'online'] }
          },
          {
            group: { $in: memberGroups.map(g => g.id) },
            $or: searchQuery,
            status: 'online',
            isPrivate: true
          }
        ],
        endDate: { $gte: Date.now() }
      }
    } else {
      find = {
        $or: searchQuery,
        status: 'online',
        isPrivate: false,
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
