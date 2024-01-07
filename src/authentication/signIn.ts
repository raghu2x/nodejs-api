import { type AuthenticatedRequest, type LoginData } from '../utils/interfaces'
import { type Response, type NextFunction } from 'express'
import { createModel, useDB } from '../database/connection'
import userValidation from '../validations/user.validation'
import { SendLoginResponse } from '../utils/apiResponse'
import { adminSignIn, loginStaffUser, studentSignIn } from './controller/signIn.controller'
import { env } from '../utils/env'
import userSchema, { type IUser } from '../schema/institute/user'
import studentSchema, { createModel as createStudentModel } from '../schema/institute/student'
import AppError from '../utils/appError'
import httpStatus from 'http-status'

type AuthRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>

interface LoginResponse extends IUser {
  token: string
}

const cookieOptions = {
  httpOnly: true,
  secure: true,
  path: '/'
}

const loginTypes = {
  staff: studentSignIn,
  admin: adminSignIn,
  student: studentSignIn
}

export const loginAccount: AuthRequestHandler = async (req, res, next) => {
  // const ipAddress = req.headers['x-forwarded-for'] ?? req.connection.remoteAddress
  try {
    const loginData: LoginData = await userValidation.login.validateAsync(req.body)

    // 1. validate userType
    const isValidUserType = Object.keys(loginTypes).includes(loginData.userType)
    if (!isValidUserType) {
      throw new AppError(httpStatus.BAD_REQUEST, `'${loginData.userType}' is not a valid userType.`)
    }

    const institutionDB = await useDB(loginData.institutionName)
    let model

    switch (loginData.userType) {
      case 'student':
        model = createStudentModel(institutionDB)
        break
      case 'staff':
        model = createModel(institutionDB, 'user', userSchema)
        break

      default:
        throw new AppError(
          httpStatus.BAD_REQUEST,
          `'${loginData.userType}' is not a valid userType.`
        )
    }

    const loginByUserType = loginTypes[loginData.userType]
    const user: LoginResponse = await loginByUserType(loginData, model)

    const { remember } = loginData
    const isLocalhost = req.hostname === 'localhost'

    const ONE_DAY = 24 * 60 * 60 * 1000 // Cookie expires after 1 day
    const ONE_YEAR = 365 * ONE_DAY // Cookie expires after 365 days
    res.cookie(env('HEADER_TOKEN_KEY'), user.token, {
      ...cookieOptions,
      maxAge: remember === true ? ONE_YEAR : ONE_DAY,
      sameSite: env('NODE_ENV') === 'production' && !isLocalhost ? 'lax' : 'none',
      domain: req.hostname
    })

    SendLoginResponse(res, user)
  } catch (error) {
    next(error)
  }
}
