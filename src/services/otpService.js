const otpModel = require('../schema/otp') // users schema
const { generateOTP, getResetToken } = require('../utils/authUtils')
const { createError } = require('../utils/helper')

const checkIfOtpExists = async (email, type) => {
  const otpExist = await otpModel.findOne({ email, type })
  if (otpExist) return otpExist
  return null
}

/**
 *
 * @param {string} email user email
 * @param {string} type ['otp','resetToken'] otp for varification resetToken for password reset
 * @returns generated code
 */
const saveOTP = async ({ email, type = 'otp' }) => {
  try {
    const existingOtp = await checkIfOtpExists(email, type)
    if (existingOtp) return existingOtp

    const code = type == 'otp' ? generateOTP() : getResetToken()

    const newOtp = await otpModel.create({ code, email, type })
    console.log('otp not exist__________', newOtp)
    return newOtp
  } catch (error) {
    throw error
  }
}

const verifyOTP = async ({ email, code, type = 'otp' }) => {
  try {
    const existingOtp = await checkIfOtpExists(email, type)
    if (!existingOtp) throw new Error(`${type} expired`)
    console.log(existingOtp.code, code, '__________')
    if (existingOtp.code !== code) throw createError('invalidOtp', null, 401)

    // OTP is verified
    return true
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }
}

module.exports = { saveOTP, verifyOTP }
