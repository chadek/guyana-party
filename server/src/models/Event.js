import mongoose, { Schema } from 'mongoose'
import slugify from 'slugify'
import Model from './Model'
import { logError } from '../core/logger'

class Event extends Model {
  initSchema() {
    const schema = new Schema(
      {
        name: { type: String, trim: true, required: true },
        description: { type: String, trim: true, required: true },
        timezone: { type: String, required: true }, // ex: "America/Cayenne"
        startDate: { type: Date, required: true }, // UTC ISO date
        endDate: { type: Date, required: true },
        location: {
          type: { type: String, default: 'Point' },
          coordinates: [Number], // [lng, lat]
          address: { type: String, required: true }
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        slug: String,
        occurrence: String, // Stringified JSON object ex: {"mon": true, "tue":false, etc...}
        photos: [String],
        group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
        groupName: String,
        published: {
          date: Date,
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        },
        isPrivate: { type: Boolean, default: true },
        status: { type: String, default: 'waiting' } // waiting | online | archived
      },
      { timestamps: true }
    )

    schema.index({ name: 'text', description: 'text', groupName: 'text' })
    schema.index({ location: '2dsphere' })

    schema.pre('save', this.preSaveHook, err => logError(err))
    schema.pre('findOneAndUpdate', this.preUpdateHook, err => logError(err))
    schema.pre('find', this.autopopulate)
    schema.pre('findOne', this.autopopulate)

    this.model = mongoose.model('Event', schema)
  }

  autopopulate(next) {
    this.populate('group')
    next()
  }

  async preSaveHook(next) {
    try {
      if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true })
        const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i')
        const eventsWithSlug = await this.constructor.find({ slug: slugRegEx })
        if (eventsWithSlug.length) {
          this.slug = `${this.slug}-${eventsWithSlug.length + 1}`
        }
      }
      const Group = mongoose.model('Group')
      const g = await Group.findById(this.group)
      if (g && g.name) this.groupName = g.name
    } catch (error) {
      logError(error)
    } finally {
      next()
    }
  }

  async preUpdateHook(next) {
    try {
      const Group = mongoose.model('Group')
      const g = await Group.findById(this._update.group)
      if (g && g.name) this._update.groupName = g.name
    } catch (error) {
      logError(error)
    } finally {
      next()
    }
  }
}

export default Event
