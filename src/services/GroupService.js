import Service from './Service'

class GroupService extends Service {
  constructor (model) {
    super(model)
    this.model = model
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
