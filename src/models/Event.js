import mongoose, { Schema } from 'mongoose'
import Model from './Model'

class Event extends Model {
  initSchema () {
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
        photos: [{ data: Buffer, contentType: String }],
        group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
        published: {
          date: Date,
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        },
        isPrivate: { type: Boolean, default: true },
        status: { type: String, default: 'waiting' } // waiting | online | archived
      },
      { timestamps: true }
    )

    schema.index({ name: 'text', description: 'text' })
    schema.index({ location: '2dsphere' })

    schema.pre('save', this.setSlug, err => console.log(err))
    schema.pre('find', this.autopopulate)
    schema.pre('findOne', this.autopopulate)

    this.model = mongoose.model('Event', schema)
  }

  autopopulate (next) {
    this.populate('group')
    next()
  }
}

export default Event
