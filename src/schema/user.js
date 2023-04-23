const mongoose = require('mongoose')
const { validate } = require('../utils/validator')
const { schemaDefault } = require('../utils/defaultSettings')
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: '',
      trim: true,
      required: [true, '{PATH} is required'],
      minLength: 3,
    },
    lastName: {
      type: String,
      default: '',
      trim: true,
      required: [true, '{PATH} is required'],
      minLength: [3, 'min 3 character required'],
    },
    email: {
      type: String,
      unique: true,
      required: [true, '{PATH} is required'],
      lowercase: true,
      trim: true,
      validate: validate('email'),
    },
    password: {
      type: String,
      required: [true, '{PATH} is required'],
      select: false,
      validate: validate('password'),
    },
    address: {
      type: Object,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    token: { type: String },
  },
  { ...schemaDefault }
)

userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`
})

userSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

userSchema.virtual('books', {
  ref: 'book',
  localField: '_id',
  foreignField: 'author',
  justOne: false,
})

module.exports = mongoose.model('user', userSchema)
