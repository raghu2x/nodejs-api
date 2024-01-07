import { type UserRegistrationData, type AuthenticatedRequest } from '../utils/interfaces'
import { type Response, type NextFunction } from 'express'
import userService from '../services/userService'
import { SendAccountCreatedResponse, sendSuccessResponse } from '../utils/apiResponse'
import userValidation from '../validations/user.validation'
import httpStatus from 'http-status'
import { getDBModel } from '../database/connection'
import { loginAccount } from './signIn'

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
