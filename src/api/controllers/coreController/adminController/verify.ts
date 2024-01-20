import { sendSuccessResponse } from '@/utils/apiResponse'
import userValidation from '@/validations/user.validation'
import httpStatus from 'http-status'
import { type IAdminUser, createModel } from '@/schema/master/admin'
import { type CustomRequestHandler } from '@/types/common'
import AppError from '@/utils/appError'
import { createModel as createOTPModel } from '@/schema/otp'
import { useDB } from '@/database/connection'
import { verifyOTP } from '@/services/otpService'

interface Payload {
  email: string
  otp: number
}

const verifyAccount: CustomRequestHandler = async (req, res, next) => {
  try {
    const masterDb = await useDB('master_database')
    const model = createModel(masterDb)

    const { email, otp }: Payload = await userValidation.verifyAccount.validateAsync(req.body)

    // @ts-expect-error - issue in get
    const existingUser: IAdminUser = await model.get(email)
    if (existingUser.verified) throw new AppError(httpStatus.OK, 'User account already verified.')

    const otpModel = createOTPModel(masterDb)

    await verifyOTP(otpModel, { email, otp })

    const user = await model.findOneAndUpdate({ email }, { verified: true }, { new: true })

    if (user == null) {
      throw new AppError(httpStatus.NOT_FOUND, `User not found with email: ${email}`)
    }

    const { password: userPassword, ...responseUser } = user.toObject()

    sendSuccessResponse(res, responseUser, httpStatus.OK, 'Account verified successfully.')
  } catch (error) {
    next(error)
  }
}

export default verifyAccount
