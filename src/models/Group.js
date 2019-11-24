import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import Model from './Model'

class Group extends Model {
  initSchema () {
    const schema = new Schema(
      {
        name: { type: String, trim: true, required: true },
        description: { type: String, trim: true, required: true },
        location: {
          type: { type: String, default: 'Point' },
          coordinates: [Number],
          address: String
        },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        slug: String,
        photo: String,
        status: { type: String, default: 'published' }, // published | archived
        community: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
              required: true
            },
            role: { type: String, default: 'guest' }, // admin | pending_request | member | denied
            memberDate: { type: Date, default: Date.now }
          }
        ]
      },
      { timestamps: true }
    )

    schema.index({ location: '2dsphere' })

    schema.plugin(uniqueValidator)

    schema.pre('save', this.setSlug, err => console.log(err))

    this.model = mongoose.model('Group', schema)
  }
}

export default Group
