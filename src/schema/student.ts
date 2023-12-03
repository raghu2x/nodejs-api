import { Schema, type Document } from 'mongoose'
import { schemaDefault } from '../utils/defaultSettings'
import { enums } from '../data' // Assuming BookStatus is an enum or constants for allowed book status values.

export interface StudentType extends Document {
  name: string
  status: keyof enums.BookStatus
  batch: string
  id: string
}

const studentSchema = new Schema<StudentType>(
  {
    name: {
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
    }
  },
  { ...schemaDefault }
)

studentSchema.virtual('id').get(function (this: StudentType) {
  return this._id.toHexString()
})

export default studentSchema
