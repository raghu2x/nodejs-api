import { Schema, type Document, type Connection, type Model } from 'mongoose'
import { schemaDefault } from '@/utils/defaultSettings'
import { enums } from '@/data' // Assuming BookStatus is an enum or constants for allowed book status values.
import { generateTemporaryCredentials } from '@/utils/generateCredentials'

export interface LoginDetail {
  id: string
  password: string
}

export interface StudentType extends Document {
  firstName: string
  lastName: string
  status: keyof enums.BookStatus
  batch: string
  id: string
  loginDetail: LoginDetail
}

const studentSchema = new Schema<StudentType>(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    batch: {
      type: String
    },
    status: {
      type: String,
      // default: enums.BookStatus.ACTIVE,
      enum: Object.values(enums.BookStatus),
      message: `Invalid status. Allowed values are ${Object.values(enums.BookStatus).join(', ')}.`
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

studentSchema.pre('validate', function (next) {
  // 'this' refers to the current document being saved
  const creds = generateTemporaryCredentials()
  this.loginDetail = creds

  console.log('😎 Student login credentials generated:', this.loginDetail)

  next()
})

export const createModel = (DB: Connection): Model<StudentType> => {
  return DB.model('Student', studentSchema)
}

export default studentSchema
