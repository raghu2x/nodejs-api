import User from '../schema/user' // users schema
import { generateToken } from '../utils/authUtils'
import { saveOTP, verifyOTP } from './otpService'
import sendMail from './sendEmail'
import userDB from '../database/User'
import { createError } from '../utils/helper'
import type {
  VerificationData,
  PasswordResetData,
  UserRegistrationData,
  LoginData
} from '../utils/interfaces'
import { type SignOptions } from 'jsonwebtoken'

const sendOTP = async ({ email, otp }: VerificationData): Promise<any> => {
  const data = { otp, to: email }
  const mailData = await sendMail(data)
  return mailData
}

const createUser = async ({
  firstName,
  lastName,
  email,
  password
}: UserRegistrationData): Promise<any> => {
  const user = await userDB.createAccount({ firstName, lastName, email, password })

  //  send OTP
  const { code: otp, email: userEmail } = await saveOTP({ email })
  await sendOTP({ otp, email: userEmail })

  return user
}

const loginUser = async ({ email, password, remember }: LoginData): Promise<any> => {
  const user = await userDB.loginUser({ email, password })

  const jwtOptions: SignOptions = {
    expiresIn: remember === true ? '36h' : process.env.JWT_TOKEN_EXPIRY
  }

  const token = generateToken({ userId: user._id, email }, jwtOptions)
  console.log('login ________________')
  return { ...user, token }
}

const verifyAccount = async ({ email, code }: VerificationData): Promise<any> => {
  try {
    // verify if account is already verified
    const existingUser = await User.get(email)
    if (existingUser.verified) throw createError('alreadyVerified', '', 200)

    // check if otp is not present than send
    if (code === undefined) {
      const { code: otp, email: userEmail } = await saveOTP({ email })
      await sendOTP({ otp, email: userEmail })
      return { message: 'OTP sent successfully' }
    }

    // verify otp here
    await verifyOTP({ email, code })
    const user = await userDB.updateUser({ email, verified: true })
    return { message: 'Account verified', data: user }
  } catch (error) {
    console.error('Error verifying account:', error)
    throw error
  }
}

const forgotPassword = async ({ email }): Promise<any> => {
  // 1. Check user exist
  await User.get(email)

  const { code } = await saveOTP({ email, type: 'resetToken' })
  await sendOTP({ otp: code, email })
  return true
}

const resetPassword = async ({ email, password, token }: PasswordResetData): Promise<any> => {
  await verifyOTP({ email, code: token, type: 'resetToken' })
  const user = await userDB.updateUser({ email, password })
  return { message: 'password reset success', data: user }
}

export default { createUser, loginUser, verifyAccount, forgotPassword, resetPassword }
