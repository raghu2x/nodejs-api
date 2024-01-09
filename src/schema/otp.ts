import mongoose, { type Schema, type Document, type Model, type Connection } from 'mongoose'
import { schemaDefault } from '../utils/defaultSettings'

interface OTP extends Document {
  email: string
  otp: string
  createdAt: Date
}

const otpSchema: Schema<OTP> = new mongoose.Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: '1m' }
    }
  },
  { ...schemaDefault, timestamps: false }
)

export const createModel = (DB: Connection): Model<OTP> => {
  return DB.model('otp', otpSchema)
}

export default otpSchema
