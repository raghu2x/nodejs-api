import mongoose, { type Schema, type Document, type Model, type Types } from 'mongoose'
import { validate } from '../utils/validator'
import { schemaDefault } from '../utils/defaultSettings'

interface User extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  address: any
  verified: boolean
  token?: string
  fullName: string
  books: Types.Array<Schema.Types.ObjectId>
}

const userSchema: Schema<User> = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: '',
      trim: true,
      required: [true, '{PATH} is required'],
      minLength: 3
    },
    lastName: {
      type: String,
      default: '',
      trim: true,
      required: [true, '{PATH} is required'],
      minLength: [3, 'min 3 characters required']
    },
    email: {
      type: String,
      unique: true,
      required: [true, '{PATH} is required'],
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validate('email').validator(value),
        message: () => validate('email').message
      }
    },
    password: {
      type: String,
      required: [true, '{PATH} is required'],
      select: false,
      validate: {
        validator: (value: string) => validate('password').validator(value),
        message: () => validate('password').message
      }
    },
    address: {
      type: Object,
      default: null
    },
    verified: {
      type: Boolean,
      default: false
    },
    token: { type: String }
  },
  { ...schemaDefault }
)

userSchema.virtual('fullName').get(function (this: User) {
  return `${this.firstName} ${this.lastName}`
})

userSchema.virtual('id').get(function (this: User) {
  return this._id.toHexString()
})

userSchema.virtual('books', {
  ref: 'book',
  localField: '_id',
  foreignField: 'author',
  justOne: false
})

const UserModel: Model<User> = mongoose.model<User>('user', userSchema)

export default UserModel
