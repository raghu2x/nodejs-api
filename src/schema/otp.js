const mongoose = require('mongoose')
const { schemaDefault } = require('../utils/defaultSettings')

const otpSchema = new mongoose.Schema(
  {
    auth: { type: String, required: true },
    token: { type: String },
    otp: { type: String, required: true },
    expiryTime: { type: Boolean, default: false },
  },
  { ...schemaDefault }
)

otpSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

module.exports = mongoose.model('otp', otpSchema)
