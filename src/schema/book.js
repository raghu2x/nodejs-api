const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaDefault } = require('../utils/defaultSettings')
const { enums } = require('../data')
const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, '{PATH} is required'],
    },
    status: {
      type: String,
      default: 'draft',
      enum: enums.bookStatus,
      // message: 'status should be one enums',
      message: ({ value }) =>
        `${value} is not a valid role. Allowed values are admin, editor, user.`,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, '{PATH} is required'],
    },
    genre: {
      ref: 'Genre',
      type: Schema.Types.ObjectId,
      default: null,
    },
  },
  { ...schemaDefault }
)

bookSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// TODO: allowed api methods
const api = {
  get: {
    allowed: true,
    auth: true,
  },
  put: {
    allowed: true,
    auth: true,
  },
  post: {
    allowed: true,
    auth: true,
  },
  delete: {
    allowed: true,
    auth: true,
  },
}

module.exports = mongoose.model('book', bookSchema)
