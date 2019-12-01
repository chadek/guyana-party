import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import isEmail from 'validator/lib/isEmail'
import Model from './Model'

class User extends Model {
  initSchema () {
    const schema = new Schema(
      {
        name: { type: String, trim: true, required: true },
        email: {
          type: String,
          unique: true,
          required: true,
          lowercase: true,
          trim: true,
          validate: [isEmail, 'Email invalide']
        },
        password: String,
        photo: String,
        valid: { type: Boolean, default: false },
        provider: String
      },
      { timestamps: true }
    )

    schema.plugin(uniqueValidator)

    this.model = mongoose.model('User', schema)
  }
}

export default User
