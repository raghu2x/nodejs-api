import { type UserRegistrationData } from '@/utils/interfaces'
import { SendAccountCreatedResponse } from '@/utils/apiResponse'
import userValidation from '@/api/validations/user.validation'
import httpStatus from 'http-status'
import { type IAdminUser, createModel } from '@/api/schema/master/admin'
import { type CustomRequestHandler } from '@/types/common'
import AppError from '@/utils/appError'
import { encrypt } from '@/utils/authUtils'
import { saveOTP } from '@/api/services/otpService'
import { createModel as createOTPModel } from '@/api/schema/otp'
import sendMail from '@/api/services/sendEmail'
import { type Connection } from 'mongoose'

const sendVerificationEmail = async (DB: Connection, email: string): Promise<void> => {
  try {
    // TODO: send verification email
    const otpModel = createOTPModel(DB)

    const { otp } = await saveOTP(otpModel, { email })
    // @ts-expect-error - otp key issue
    await sendMail({ to: email, otp })

    console.log('Verification email sent.')
  } catch (error) {
    console.log('😢 Can not send Verification mail')
  }
}
// create account
const createAccount: CustomRequestHandler = async (req, res, next) => {
  try {
    const model = createModel(req.masterDb)

    // 1. validate req data
    const userRegData: UserRegistrationData = await userValidation.register.validateAsync(req.body)

    // 2. encrypt password
    userRegData.password = await encrypt(userRegData.password)

    // 3. create user
    const createdUser: IAdminUser = await model.create(userRegData)
    const { password: userPassword, ...responseUser } = createdUser.toObject()

    // send verification email
    void sendVerificationEmail(req.masterDb, userRegData.email)

    SendAccountCreatedResponse(res, responseUser)
  } catch (error) {
    // mongoose error code
    if (error.code === 11000) {
      const duplicateEmailError = new AppError(httpStatus.CONFLICT, "'Email' already exists")
      next(duplicateEmailError)
      return
    }
    next(error)
  }
}

export default createAccount
