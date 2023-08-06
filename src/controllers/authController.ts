import { type Request, type Response, type NextFunction } from 'express'
import userService from '../services/userService'
import { generateOTP } from '../utils/authUtils'
import sendMail from '../services/sendEmail'

// create account
const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { firstName, lastName, email, password } = req.body

  try {
    const data = await userService.createUser({
      firstName,
      lastName,
      email,
      password
    })
    res.status(201).send({
      success: true,
      message: 'Please verify your email to continue.'
      // data,
    })
  } catch (error) {
    next(error)
  }
}

const loginAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body

  try {
    const user = await userService.loginUser({ email, password })
    res.status(200).send({ success: true, message: 'login successful', data: user })
  } catch (error) {
    next(error)
  }
}

const sendEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const OTP = generateOTP()
  const data = { OTP, to: 'raghvendra4077@gmail.com' }
  try {
    await sendMail(data)
    res.send({ success: true, message: 'Email sent' })
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { code, email } = req.body
  try {
    const data = await userService.verifyAccount({ code, email })
    res.send({ success: true, ...data })
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body
  try {
    const data = await userService.forgotPassword({ email })
    res.send({
      success: true,
      message: 'Check your email to reset your password'
    })
  } catch (error) {
    next(error)
  }
}

const resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { token } = req.params
  const { password, email } = req.body
  try {
    const data = await userService.resetPassword({ password, token, email })
    res.send({ success: true, ...data })
  } catch (error) {
    next(error)
  }
}

export default {
  createAccount,
  loginAccount,
  sendEmail,
  verifyAccount,
  forgotPassword,
  resetPassword
}
