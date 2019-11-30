import mongoose from 'mongoose'

class Service {
  constructor (model) {
    this.model = model
  }

  readAll = (query, next, fallback) => {
    let { skip, limit, sort } = query

    skip = skip ? Number(skip) : 0
    limit = limit ? Number(limit) : 10
    sort = sort || '-createdAt'

    delete query.skip
    delete query.limit
    delete query.sort

    if (query._id) {
      try {
        query._id = new mongoose.mongo.ObjectId(query._id)
      } catch (err) {
        return fallback(err)
      }
    }

    this.model
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .then(next)
      .catch(fallback)
  }

  read = (id, next, fallback) => {
    this.model
      .findById(id)
      .then(next)
      .catch(fallback)
  }

  create = (body, next, fallback) => {
    this.model
      .create(body)
      .then(next)
      .catch(fallback)
  }

  update = (id, body, next, fallback) => {
    this.model
      .findByIdAndUpdate(id, body, { new: true })
      .then(data => {
        if (!data) return fallback({ message: 'not found', status: 404 })
        next(data)
      })
      .catch(fallback)
  }

  delete = (id, next, fallback) => {
    // TODO: delete photos
    this.model
      .findByIdAndDelete(id)
      .then(data => {
        if (!data) return fallback({ message: 'not found', status: 404 })
        next(data)
      })
      .catch(fallback)
  }

  // delete = async (id, next, fallback) => {
  //   const post = await this.model.findById(id)
  //   if (post) {
  //     const filename = post.imageUrl.split('/uploads/')[1]
  //     fs.unlink('uploads/' + filename, () => {
  //       this.model
  //         .findByIdAndDelete(id)
  //         .then(data => {
  //           if (!data) return fallback({ message: 'not found', status: 404 })
  //           next(data)
  //         })
  //         .catch(fallback)
  //     })
  //   } else {
  //     fallback({ message: 'not found', status: 404 })
  //   }
  // }
}

export default Service
