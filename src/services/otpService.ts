import otpModel from '../schema/otp' // users schema
import { generateOTP, getResetToken } from '../utils/authUtils'
import { createError } from '../utils/helper'

interface OtpData {
  email: string
  type?: string
  code?: string
}

const checkIfOtpExists = async (email: string, type: string): Promise<OtpData | false> => {
  const otpExist = await otpModel.findOne({ email, type })
  if (otpExist != null) return otpExist
  return false
}

const saveOTP = async ({ email, type = 'otp' }: OtpData): Promise<OtpData> => {
  const existingOtp = await checkIfOtpExists(email, type)
  if (existingOtp !== false) return existingOtp

  const code = type === 'otp' ? generateOTP() : getResetToken()

  const newOtp = await otpModel.create({ code, email, type })
  console.log('otp not exist__________', newOtp)
  return newOtp
}

const verifyOTP = async ({ email, code, type = 'otp' }: OtpData): Promise<boolean> => {
  try {
    const existingOtp = await checkIfOtpExists(email, type)
    if (existingOtp === false) throw new Error(`${type} expired`)
    console.log(existingOtp.code, code, '__________')
    if (existingOtp.code !== code) throw createError('invalidOtp', '', 401)

    // OTP is verified
    return true
  } catch (error) {
    console.error('Error verifying OTP:', error)
    throw error
  }
}

export { saveOTP, verifyOTP }
