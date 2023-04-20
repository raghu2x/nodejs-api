const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Books = require('../schema/book') // users schema
const { schemaDefault } = require('../utils/defaultSettings')

const GenreSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, '{PATH} is required'],
    },
    description: {
      type: String,
      default: null,
    },
  },
  { ...schemaDefault }
)

GenreSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

module.exports = {
  Genre: mongoose.model('Genre', GenreSchema),
  Books,
}
