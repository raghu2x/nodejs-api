import { type IUser } from '../schema/institute/user' // users schema
import { compare, generateToken } from '../utils/authUtils'
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
import AppError from '../utils/appError'
import httpStatus from 'http-status'

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

const loginUser = async (userData: LoginData, model): Promise<any> => {
  const { remember, institutionName, email, password } = userData

  // 1. get User using email
  const user: IUser = await model.get(email)

  // 2. compare passwords
  if (!(await compare(password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Email or Password is wrong')
  }

  // 3. check email verification
  if (!user.verified) throw createError('notVerified', '', 401)

  const { password: userPassword, ...responseUser } = user.toObject()

  const jwtOptions: SignOptions = {
    expiresIn: remember === true ? '36h' : process.env.JWT_TOKEN_EXPIRY
  }

  const tokenPayload = {
    userId: user._id,
    email,
    institutionName
  }
  const token = generateToken(tokenPayload, jwtOptions)
  console.log('login ________________')
  return { ...responseUser, token }
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
