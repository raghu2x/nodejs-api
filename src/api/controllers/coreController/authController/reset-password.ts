import { encrypt } from '@/utils/authUtils'
import { sendSuccessResponse } from '@/utils/apiResponse'
import userValidation from '@/validations/user.validation'
import httpStatus from 'http-status'

import { createModel } from '@/schema/master/admin'
import { type CustomRequestHandler } from '@/types/common'
import { verifyOTP } from '@/services/otpService'
import { createModel as createOTPModel } from '@/schema/otp'
import AppError from '@/utils/appError'

interface ResetPasswordData {
  otp: number
  password: string
  email: string
  confirmPassword: string
}

const resetPassword: CustomRequestHandler = async (req, res, next) => {
  try {
    const model = createModel(req.masterDb)
    const payload: ResetPasswordData = await userValidation.resetPassword.validateAsync(req.body)

    const otpModel = createOTPModel(req.masterDb)

    await verifyOTP(otpModel, { email: payload.email, otp: payload.otp })

    // encrypt password
    const password = await encrypt(payload.password)

    const user = await model.findOneAndUpdate({ email: payload.email }, { password }, { new: true })

    if (user == null) {
      throw new AppError(httpStatus.NOT_FOUND, `User not found with email: ${payload.email}`)
    }

    const { password: userPassword, ...responseUser } = user.toObject()

    sendSuccessResponse(res, responseUser, httpStatus.OK, 'Password reset successfully.')
  } catch (error) {
    next(error)
  }
}

export default resetPassword
