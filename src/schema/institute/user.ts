import mongoose, { type Schema, type Document, type Model, type Types } from 'mongoose'
import { validate } from '../../utils/validator'
import { schemaDefault } from '../../utils/defaultSettings'
import AppError from '../../utils/appError'
import httpStatus from 'http-status'

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  address: any
  verified: boolean
  token?: string
  fullName: string
}

export interface IUserModel extends Model<IUser> {
  // Define your static methods here
  get: (email: string) => Promise<IUser>
  checkDuplicateEmail: (error: Error) => Error | AppError
  correctPassword: (password: string) => true
}

export const userSchema: Schema<IUser> = new mongoose.Schema(
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

userSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`
})

userSchema.virtual('id').get(function (this: IUser) {
  return this._id.toHexString()
})

userSchema.statics.get = async function (email: string): Promise<IUser | null> {
  const user: IUser | null = await this.findOne({ email }).select('+password').exec()

  if (user !== null) {
    return user
  }

  throw new AppError(httpStatus.NOT_FOUND, 'User does not exist')
}

userSchema.statics.checkDuplicateEmail = function (error): Error | AppError {
  console.log(error, '----------------------mongooge error')
  if (error.code === 11000) {
    return new AppError(httpStatus.CONFLICT, "'Email' already exists")
  }
  return error
}

export default userSchema
