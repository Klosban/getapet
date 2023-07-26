const mongoose = require('../db/conn')
const { Schema } = mongoose
const moment = require('moment')
require('moment-timezone')

const PetSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    weight: { type: Number, required: true },
    color: { type: String, required: true },
    images: { type: Array, required: true },
    available: { type: Boolean },
    user: Object,
    adopter: Object
  },
  { timestamps: true }
)

PetSchema.methods.toJSON = function () {
  const pet = this.toObject()
  pet.createdAt = moment(pet.createdAt).tz('America/Sao_Paulo').format()
  pet.updatedAt = moment(pet.updatedAt).tz('America/Sao_Paulo').format()
  return pet
}

const Pet = mongoose.model('Pet', PetSchema)

module.exports = Pet