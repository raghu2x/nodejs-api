const mongoose = require('mongoose')
const { schemaDefault } = require('../utils/defaultSettings')

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    code: { type: String, required: true },
    type: { type: String, required: true, enum: ['otp', 'resetToken'] },
    createdAt: {
      type: Date,
      default: Date.now,
      index: { expires: '1m' },
    },
  },
  { ...schemaDefault, timestamps: false }
)

module.exports = mongoose.model('otp', otpSchema)
