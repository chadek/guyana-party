const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
const md5 = require("md5");
const validator = require("validator");
const mongodbErrorHandler = require("mongoose-mongodb-errors");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    valdidate: [validator.isEmail, "Invalid Email Address"],
    require: "Please supply an email address"
  },
  name: {
    type: String,
    require: "Please supply a name",
    trim: true
  },
  photo: String,
  isValid: {
    type: Boolean,
    default: true
  },
  membership: [String],
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

userSchema.virtual("gravatar").get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.statics.getMembershipList = function() {
  return this.aggregate([
    { $unwind: "$membership" },
    { $group: { _id: "$membership", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
};

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model("User", userSchema);
