import {
  type UserRegistrationData,
  type AuthenticatedRequest,
  type LoginData
} from '../utils/interfaces'
import { type Response, type NextFunction } from 'express'
import userService from '../services/userService'
import {
  SendAccountCreatedResponse,
  SendLoginResponse,
  sendSuccessResponse
} from '../utils/apiResponse'
import userValidation from '../validations/user.validation'
import httpStatus from 'http-status'
import { getDBModel } from '../database/connection'
import { env } from '../utils/env'

// create account
const createAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const model = getDBModel(req.schoolDb, 'user')
    const value: UserRegistrationData = await userValidation.register.validateAsync(req.body)
    await userService.createUser(value, model)

    SendAccountCreatedResponse(res)
  } catch (error) {
    next(error)
  }
}

const loginAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // const ipAddress = req.headers['x-forwarded-for'] ?? req.connection.remoteAddress
  try {
    const model = getDBModel(req.schoolDb, 'user')
    const value: LoginData = await userValidation.login.validateAsync(req.body)
    const schoolId = req.get('x-school-id') as string

    const user = await userService.loginUser(value, model, schoolId)

    const { remember } = value
    const isLocalhost = req.hostname === 'localhost'

    const ONE_DAY = 24 * 60 * 60 * 1000 // Cookie expires after 1 day
    const ONE_YEAR = 365 * ONE_DAY // Cookie expires after 365 days
    res.cookie(env('HEADER_TOKEN_KEY'), user.token, {
      maxAge: remember === true ? ONE_YEAR : ONE_DAY,
      sameSite: process.env.NODE_ENV === 'production' && !isLocalhost ? 'lax' : 'none',
      httpOnly: true,
      secure: true,
      domain: req.hostname,
      path: '/'
    })

    SendLoginResponse(res, user)
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { code, email } = req.body
  try {
    const model = getDBModel(req.schoolDb, 'user')
    const data = await userService.verifyAccount({ code, email }, model)
    res.send({ success: true, ...data })
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const model = getDBModel(req.schoolDb, 'user')
    const value = await userValidation.forgotPassword.validateAsync(req.body)
    await userService.forgotPassword(value, model)
    sendSuccessResponse(res, undefined, httpStatus.OK, 'OTP sent on your email for password reset.')
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const model = getDBModel(req.schoolDb, 'user')
    const value = await userValidation.resetPassword.validateAsync(req.body)
    const data = await userService.resetPassword(value, model)
    sendSuccessResponse(res, data, httpStatus.OK, 'Account verified.')
  } catch (error) {
    next(error)
  }
}

export default {
  createAccount,
  loginAccount,
  verifyAccount,
  forgotPassword,
  resetPassword
}
