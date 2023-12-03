import { Schema, type Document } from 'mongoose'
import { schemaDefault } from '../utils/defaultSettings'
import { enums } from '../data' // Assuming BookStatus is an enum or constants for allowed book status values.
import httpStatus from 'http-status'
import AppError from 'utils/appError'

export interface InstituteType extends Document {
  name: string
  schoolId: string
  status: keyof enums.BookStatus
  id: string
}

const instituteSchema = new Schema<InstituteType>(
  {
    name: {
      type: String,
      required: true
    },
    schoolId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      // default: enums.BookStatus.ACTIVE,
      enum: Object.values(enums.BookStatus),
      message: `Invalid status. Allowed values are ${Object.values(enums.BookStatus).join(', ')}.`
    }
  },
  { ...schemaDefault }
)

instituteSchema.virtual('id').get(function (this: InstituteType) {
  return this._id.toHexString()
})

instituteSchema.statics.get = async function (email: string): Promise<InstituteType | null> {
  const institute: InstituteType | null = await this.findOne({ email }).select('+password').exec()

  if (institute !== null) {
    return institute
  }

  throw new AppError(httpStatus.NOT_FOUND, 'Institute does not exist')
}

export default instituteSchema
