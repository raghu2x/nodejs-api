import { type IUser } from '../schema/institute/user' // users schema
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

const createUser = async (userData: UserRegistrationData, model): Promise<any> => {
  const user = await userDB.createAccount(userData, model)

  //  send OTP
  const { code: otp, email: userEmail } = await saveOTP({ email: userData.email })
  await sendOTP({ otp, email: userEmail })

  return user
}

const loginUser = async (
  { remember, ...userForm }: LoginData,
  model,
  schooId: string
): Promise<any> => {
  const user = await userDB.loginUser(userForm, model)

  const jwtOptions: SignOptions = {
    expiresIn: remember === true ? '36h' : process.env.JWT_TOKEN_EXPIRY
  }

  const token = generateToken({ userId: user._id, email: userForm.email, schooId }, jwtOptions)
  console.log('login ________________')
  return { ...user, token }
}

const verifyAccount = async ({ email, code }: VerificationData, model): Promise<any> => {
  try {
    // verify if account is already verified
    const existingUser: IUser = await model.get(email)
    if (existingUser.verified) throw createError('alreadyVerified', '', 200)

    // check if otp is not present than send
    if (code === undefined) {
      const { code: otp, email: userEmail } = await saveOTP({ email })
      await sendOTP({ otp, email: userEmail })
      return { message: 'OTP sent successfully' }
    }

    // verify otp here
    await verifyOTP({ email, code })
    const user = await userDB.updateUser({ email, verified: true }, model)
    return { message: 'Account verified', data: user }
  } catch (error) {
    console.error('Error verifying account:', error)
    throw error
  }
}

const forgotPassword = async ({ email }, model): Promise<any> => {
  // 1. Check user exist
  await model.get(email)

  const { code } = await saveOTP({ email, type: 'resetToken' })
  await sendOTP({ otp: code, email })
  return true
}

const resetPassword = async ({ token, ...restForm }: PasswordResetData, model): Promise<any> => {
  await verifyOTP({ email: restForm.email, code: token, type: 'resetToken' })
  const user = await userDB.updateUser(restForm, model)
  return { message: 'password reset success', data: user }
}

export default { createUser, loginUser, verifyAccount, forgotPassword, resetPassword }
