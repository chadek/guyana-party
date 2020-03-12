import slugify from 'slugify'
import { logError } from '../core/logger'

class Model {
  constructor() {
    this.model = null
  }

  static initSchema() {}

  getInstance() {
    this.initSchema()
    return this.model
  }

  async setSlug(next) {
    try {
      if (!this.isModified('name')) return next()
      this.slug = slugify(this.name, { lower: true })
      const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
      const eventsWithSlug = await this.constructor.find({ slug: slugRegEx })
      if (eventsWithSlug.length) {
        this.slug = `${this.slug}-${eventsWithSlug.length + 1}`
      }
    } catch (error) {
      logError(error)
    } finally {
      next()
    }
  }
}

export default Model
