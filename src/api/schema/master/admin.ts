import mongoose, { type Schema, type Document, type Model, type Connection } from 'mongoose'
import { validate } from '@/utils/validator'
import { schemaDefault } from '@/utils/defaultSettings'
import AppError from '@/utils/appError'
import httpStatus from 'http-status'

export interface IAdminUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  address: any
  verified: boolean
  token?: string
  fullName: string
}

export interface IAdminUserModel extends Model<IAdminUser> {
  // Define your static methods here
  get: (email: string) => Promise<IAdminUser>
  checkDuplicateEmail: (error: Error) => Error | AppError
  correctPassword: (password: string) => true
}

export const adminUserSchema: Schema<IAdminUser> = new mongoose.Schema(
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

adminUserSchema.virtual('fullName').get(function (this: IAdminUser) {
  return `${this.firstName} ${this.lastName}`
})

// adminUserSchema.virtual('id').get(function (this: IAdminUser) {
//   return this._id.toHexString()
// })

adminUserSchema.statics.get = async function (email: string): Promise<IAdminUser | null> {
  const user: IAdminUser | null = await this.findOne({ email }).select('+password').exec()

  if (user !== null) {
    return user
  }

  throw new AppError(httpStatus.NOT_FOUND, 'User does not exist')
}

adminUserSchema.statics.checkDuplicateEmail = function (error): Error | AppError {
  console.log(error, '----------------------mongooge error')
  if (error.code === 11000) {
    return new AppError(httpStatus.CONFLICT, "'Email' already exists")
  }
  return error
}

export const createModel = (DB: Connection): Model<IAdminUser> => {
  return DB.model('admin', adminUserSchema)
}

export default adminUserSchema
