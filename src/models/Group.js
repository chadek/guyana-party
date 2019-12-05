import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import Model from './Model'

class Group extends Model {
  initSchema () {
    const schema = new Schema(
      {
        name: { type: String, trim: true, required: true },
        description: { type: String, trim: true, required: true },
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        slug: String,
        photos: [{ data: Buffer, contentType: String }],
        status: { type: String, default: 'online' }, // online | archived
        community: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'User',
              required: true
            },
            role: { type: String, default: 'guest' }, // admin | pending_request | member | denied | guest (default)
            memberDate: { type: Date, default: Date.now }
          }
        ]
      },
      { timestamps: true }
    )

    schema.plugin(uniqueValidator)

    schema.pre('save', this.setSlug, err => console.log(err))
    schema.pre('find', this.autopopulate)
    // schema.pre('findOne', this.autopopulate)

    this.model = mongoose.model('Group', schema)
  }

  autopopulate (next) {
    this.populate('community.user')
    next()
  }
}

export default Group
