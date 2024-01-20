import { type LoginData } from '@/utils/interfaces'
import { useDB } from '@/database/connection'
import userValidation from '@/api/validations/user.validation'
import { SendLoginResponse } from '@/utils/apiResponse'
import adminLogin from './admin-login'
import userLogin from './user-login'
import { env } from '@/utils/env'
import AppError from '@/utils/appError'
import httpStatus from 'http-status'

// models
import { createModel as createStaffModel } from '@/api/schema/institute/user'
import { createModel as createStudentModel } from '@/api/schema/institute/student'
import { createModel as createAdminModel } from '@/api/schema/master/admin'
import { USER_TYPES } from '@/data/constants'
import { type CustomRequestHandler } from '@/types/common'

interface LoginResponse {
  token: string
}

const cookieOptions = {
  httpOnly: true,
  secure: true,
  path: '/'
}

export const loginAccount: CustomRequestHandler = async (req, res, next) => {
  // const ipAddress = req.headers['x-forwarded-for'] ?? req.connection.remoteAddress
  try {
    const loginData: LoginData = await userValidation.login.validateAsync(req.body)
    console.log(req.body.userType)
    const { userType, institutionName, remember } = loginData

    let user: LoginResponse = { token: '' }
    let model

    if (userType === USER_TYPES.ADMIN) {
      const masterDB = await useDB('master_database')
      model = createAdminModel(masterDB)
      // 1. Login admin user
      user = await adminLogin(loginData, model)
    } else {
      const institutionDB = await useDB(institutionName)

      switch (userType) {
        case USER_TYPES.STUDENT:
          model = createStudentModel(institutionDB)
          break
        case USER_TYPES.STAFF:
          model = createStaffModel(institutionDB)
          break
        default:
          throw new AppError(httpStatus.BAD_REQUEST, `'${userType}' is not a valid userType.`)
      }

      user = await userLogin(loginData, model)
    }

    // Generate token & send Response
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
