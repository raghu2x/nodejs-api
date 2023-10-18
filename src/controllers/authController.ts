import { type Request, type Response, type NextFunction } from 'express'
import userService from '../services/userService'
import { generateOTP } from '../utils/authUtils'
import sendMail from '../services/sendEmail'
import { SendAccountCreatedResponse } from '../utils/apiResponse'

// create account
const createAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { firstName, lastName, email, password } = req.body

  try {
    await userService.createUser({
      firstName,
      lastName,
      email,
      password
    })

    SendAccountCreatedResponse(res)
  } catch (error) {
    next(error)
  }
}

const loginAccount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, remember } = req.body

  const ipAddress = req.headers['x-forwarded-for'] ?? req.connection.remoteAddress

  try {
    const user = await userService.loginUser({ email, password, remember })
    res.status(200)
    console.log(ipAddress)
    console.log(req.hostname)

    const isLocalhost = req.hostname === 'localhost'
    res.cookie('token', user.token, {
      maxAge: remember === true ? 365 * 24 * 60 * 60 * 1000 : undefined, // Cookie expires after 30 days
      sameSite: process.env.NODE_ENV === 'production' && !isLocalhost ? 'lax' : 'none',
      httpOnly: true,
      secure: true,
      domain: req.hostname,
      path: '/'
    })

    res.send({ success: true, message: 'login successful', data: user })
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
