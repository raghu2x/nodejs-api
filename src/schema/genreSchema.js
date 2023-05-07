const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaDefault } = require('../utils/defaultSettings')

const GenreSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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

module.exports = mongoose.model('Genre', GenreSchema)
