const otpModel = require('../schema/otp') // users schema
const { generateOTP } = require('../utils/authUtils')

const saveOTP = async ({ email }) => {
  try {
    const otp = generateOTP()
    const otpExpiry = new Date()

    const newOtp = await otpModel.create({
      otp,
      otpExpiry,
      auth: email,
    })
    return newOtp
  } catch (error) {
    throw new Error('Error in OTP create')
  }
}

const verifyOTP = async ({ email, otp }) => {
  try {
    const data = await otpModel.findOne({ auth: email })
    if (!data) {
      throw new Error('Email not found in database')
    }
    if (data.otp !== otp) {
      console.log(data.otp, otp, '________________________')
      throw new Error('Invalid OTP')
    }
    // OTP is verified
    return true
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }
}

module.exports = { saveOTP, verifyOTP }
