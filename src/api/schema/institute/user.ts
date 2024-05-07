import mongoose, { type Schema, type Document, type Model, type Connection } from 'mongoose'
import { validate } from '@/utils/validator'
import { schemaDefault } from '@/utils/defaultSettings'
import { generateTemporaryCredentials } from '@/utils/generateCredentials'
import { getModelByTenant } from '@/database/connection'

export interface LoginDetail {
  id: string
  password: string
}

export interface IUser extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  address: any
  verified: boolean
  token?: string
  fullName: string
  id: string
  loginDetail: LoginDetail
}

export interface IUserModel extends Model<IUser> {
  // Define your static methods here
  get: (email: string) => Promise<IUser>
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
      lowercase: true,
      trim: true,
      validate: {
        validator: (value: string) => validate('email').validator(value),
        message: () => validate('email').message
      }
    },
    address: {
      type: Object,
      default: null
    },
    loginDetail: {
      id: {
        type: String,
        required: true
      },
      password: {
        type: String,
        required: true
      }
    }
  },
  { ...schemaDefault }
)

userSchema.virtual('fullName').get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`
})

userSchema.pre('validate', function (next) {
  // 'this' refers to the current document being saved
  const creds = generateTemporaryCredentials()

  this.loginDetail = creds

  console.log('😎 Staff login credentials generated:', this.loginDetail)

  next()
})

export const createModel = (DB: Connection): Model<IUser> => {
  return DB.model('user', userSchema)
}

export const getUserModel = (tenantId: string): Model<IUser> => {
  return getModelByTenant<IUser>(tenantId, 'student', userSchema)
}

export default userSchema
