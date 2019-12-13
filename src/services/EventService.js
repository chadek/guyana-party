import mongoose from 'mongoose'
import Service from './Service'

class EventService extends Service {
  constructor (model) {
    super(model)
    this.model = model
  }

  search = async query => {
    const { skip, limit, sort, search, uid, box, isapp } = query
    let find = {}

    const searchQuery = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'igm' } }
    ]

    if (uid) {
      const Group = mongoose.model('Group')

      const adminGroups = await Group.find(
        {
          status: 'online',
          community: { $elemMatch: { user: uid, role: 'admin' } }
        },
        { id: true }
      )

      const memberGroups = await Group.find(
        {
          status: 'online',
          community: { $elemMatch: { user: uid, role: 'member' } }
        },
        { id: true }
      )

      find = {
        $or: [
          {
            group: { $in: adminGroups.map(g => g.id) },
            $or: searchQuery,
            status: { $in: ['waiting', 'online'] }
          },
          {
            group: { $in: memberGroups.map(g => g.id) },
            $or: searchQuery,
            status: 'online'
          }
        ],
        endDate: { $gte: Date.now() }
      }
      if (!isapp) {
        find.$or.push({
          $or: searchQuery,
          status: 'online',
          isPrivate: false
        })
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

    return this.model
      .find(find)
      .skip(skip)
      .limit(limit)
      .sort(sort)
  }
}

export default EventService
