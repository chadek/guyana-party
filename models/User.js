const mongoose = require("mongoose");
const md5 = require("md5");
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    valdidate: [validator.isEmail, "Email Invalide"],
    require: "L'email est requis."
  },
  name: {
    type: String,
    unique: true,
    trim: true,
    required: "Veuillez saisir un identifiant."
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    required: "slug required."
  },
  photo: String,
  isValid: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.index({
  email: "text",
  slug: "text"
});

userSchema.virtual("gravatar").get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
