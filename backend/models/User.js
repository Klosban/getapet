const mongoose = require('../db/conn')
const { Schema } = mongoose
const moment = require('moment')
require('moment-timezone')

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
    phone: { type: String, required: true }
  },
  { timestamps: true }
)

UserSchema.methods.toJSON = function () {
  const user = this.toObject()
  user.createdAt = moment(user.createdAt).tz('America/Sao_Paulo').format()
  user.updatedAt = moment(user.updatedAt).tz('America/Sao_Paulo').format()
  return user
}

const User = mongoose.model('User', UserSchema)

module.exports = User