import mongoose, { type Schema, type Document, type Model } from 'mongoose'
import { schemaDefault } from '../utils/defaultSettings'

interface OTP extends Document {
  email: string
  code: string
  type: 'otp' | 'resetToken' // The 'type' field should have a specific enum type.
  createdAt: Date
}

const otpSchema: Schema<OTP> = new mongoose.Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, required: true, enum: ['otp', 'resetToken'] },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: '1m' }
    }
  },
  { ...schemaDefault, timestamps: false }
)

const OTPModel: Model<OTP> = mongoose.model<OTP>('otp', otpSchema)

export default OTPModel
