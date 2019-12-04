import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import Model from './Model'

class Event extends Model {
  initSchema () {
    const schema = new Schema(
      {
        name: { type: String, trim: true, required: true },
        description: { type: String, trim: true, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        // timezone: { type: String, required: true }, // ex: "(UTC-03:00) America/Cayenne"
        location: {
          type: { type: String, default: 'Point' },
          coordinates: [Number],
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
        // published: {
        //   date: Date,
        //   publisher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        // },
        // public: { type: Boolean, default: false },
        // status: { type: String, default: 'paused' } // paused | published | archived
        isPrivate: { type: Boolean, default: true },
        status: { type: String, default: 'waiting' } // waiting | online | archived
      },
      { timestamps: true }
    )

    schema.index({ location: '2dsphere' })

    schema.plugin(uniqueValidator)

    schema.pre('save', this.setSlug, err => console.log(err))

    this.model = mongoose.model('Event', schema)
  }
}

export default Event
