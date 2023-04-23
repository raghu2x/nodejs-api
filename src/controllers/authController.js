const userService = require('../services/userService')
const { generateOTP } = require('../utils/authUtils')
const { sendMail } = require('../services/sendEmail')

// create account
const createAccount = async (req, res, next) => {
  const { firstName, lastName, email, password, address } = req.body

  try {
    const data = await userService.createUser({ firstName, lastName, email, password, address })
    res.status(201).send({
      success: true,
      message: 'account created verify your email to continue',
      data,
    })
  } catch (error) {
    next(error)
  }
}

const loginAccount = async (req, res, next) => {
  const { email, password } = req.body

  try {
    const user = await userService.loginUser({ email, password })
    res.status(200).send({ success: true, message: 'login successfull', data: user })
  } catch (error) {
    next(error)
  }
}

const sendEmail = async (req, res, next) => {
  const OTP = generateOTP()
  const data = { OTP, to: 'raghvendra4077@gmail.com' }
  try {
    await sendMail(data)
    res.send({ success: true, message: 'Email send' })
  } catch (error) {
    next(error)
  }
}

const verifyAccount = async (req, res, next) => {
  const { code, email } = req.body
  try {
    const data = await userService.verifyAccount({ code, email })
    res.send({ success: true, ...data })
  } catch (error) {
    next(error)
  }
}
const forgotPassword = async (req, res, next) => {
  const { email } = req.body
  try {
    const data = await userService.forgotPassword({ email })
    res.send({ success: true, message: 'Check your email to reset your password' })
  } catch (error) {
    next(error)
  }
}
const resetPassword = async (req, res, next) => {
  const { token } = req.params
  const { password, email } = req.body
  try {
    const data = await userService.resetPassword({ password, token, email })
    res.send({ success: true, ...data })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  createAccount,
  loginAccount,
  sendEmail,
  verifyAccount,
  forgotPassword,
  resetPassword,
}
