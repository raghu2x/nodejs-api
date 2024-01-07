import { type IUser } from '../../schema/institute/user' // users schema
import { compare, generateToken } from '../../utils/authUtils'
import { createError } from '../../utils/helper'
import type { LoginData } from '../../utils/interfaces'
import { type SignOptions } from 'jsonwebtoken'
import AppError from '../../utils/appError'
import httpStatus from 'http-status'

export const adminSignIn = async (userData: LoginData, model): Promise<any> => {
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

  console.log('👍 User verified login In.')

  return { ...responseUser, token }
}

/**
 * This function will be used for authenticate : student|staff|parent
 * @param userData - LoginReq data
 * @param model - user model
 * @returns
 */
export const userSignIn = async (userData: LoginData, model): Promise<any> => {
  const { remember, institutionName, userId, userType, password } = userData

  const user = await model.findOne({
    'loginDetail.password': password,
    'loginDetail.id': userId
  })

  if (user === null) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'userId or password is wrong.')
  }

  const { loginDetail, ...responseUser } = user.toObject()

  const jwtOptions: SignOptions = {
    expiresIn: remember === true ? '36h' : process.env.JWT_TOKEN_EXPIRY
  }

  const tokenPayload = {
    userId: user._id,
    userType,
    institutionName
  }
  const token = generateToken(tokenPayload, jwtOptions)

  console.log('👍 User verified login In.')

  return { ...responseUser, token }
}
