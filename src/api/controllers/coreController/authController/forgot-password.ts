import { sendSuccessResponse } from '@/utils/apiResponse'
import userValidation from '@/api/validations/user.validation'
import httpStatus from 'http-status'
import { type CustomRequestHandler } from '@/types/common'
import { saveOTP } from '@/api/services/otpService'
import { createModel as createOTPModel } from '@/api/schema/otp'
import sendMail from '@/api/services/sendEmail'
import { type Connection } from 'mongoose'

interface ForgotPasswordReqData {
  email: string
}

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

const forgotPassword: CustomRequestHandler = async (req, res, next) => {
  try {
    const payload: ForgotPasswordReqData = await userValidation.forgotPassword.validateAsync(
      req.body
    )

    void sendVerificationEmail(req.masterDb, payload.email)

    sendSuccessResponse(res, undefined, httpStatus.OK, 'OTP sent on your email for password reset.')
  } catch (error) {
    next(error)
  }
}

export default forgotPassword
