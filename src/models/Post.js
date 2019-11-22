import mongoose, { Schema } from 'mongoose'
import Model from './Model'

class Post extends Model {
  initSchema () {
    const schema = new Schema(
      {
        name: { type: String, required: true },
        description: { type: String, required: false },
        content: { type: String, required: true },
        imageUrl: String,
        slug: String
      },
      { timestamps: true }
    )

    schema.pre('save', this.setSlug, err => console.log(err))

    this.model = mongoose.model('Post', schema)
  }
}

export default Post
