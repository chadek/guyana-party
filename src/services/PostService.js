import fs from 'fs'
import Service from './Service'

class PostService extends Service {
  constructor (model) {
    super(model)
    this.model = model
  }

  delete = async (id, next, fallback) => {
    const post = await this.model.findById(id)
    if (post) {
      const filename = post.imageUrl.split('/uploads/')[1]
      fs.unlink('uploads/' + filename, () => {
        this.model
          .findByIdAndDelete(id)
          .then(data => {
            if (!data) return fallback({ message: 'not found', status: 404 })
            next(data)
          })
          .catch(fallback)
      })
    } else {
      fallback({ message: 'not found', status: 404 })
    }
  }
}

export default PostService
