import { Schema, type Document } from 'mongoose'
import { schemaDefault } from '../../utils/defaultSettings'
import { enums } from '../../data' // Assuming BookStatus is an enum or constants for allowed book status values.

export interface StudentType extends Document {
  firstName: string
  lastName: string
  status: keyof enums.BookStatus
  batch: string
  id: string
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
    }
  },
  { ...schemaDefault }
)

export default studentSchema
