const User = require('../schema/user') // users schema
const { generateToken, compare, getResetToken } = require('../utils/authUtils')
const { saveOTP, verifyOTP } = require('./otpService')
const { sendMail } = require('../services/sendEmail')
const userDB = require('../database/User')
const { createError } = require('../utils/helper')

const sendOTP = async ({ email, otp }) => {
  const data = { otp, to: email }
  try {
    const mailData = await sendMail(data)
    return mailData
  } catch (error) {
    throw new Error('Unable to send OTP')
  }
}

const createUser = async ({ firstName, lastName, email, password }) => {
  try {
    const user = await userDB.createAccount({ firstName, lastName, email, password })

    //  send OTP
    const { otp, auth } = await saveOTP({ email })
    await sendOTP({ otp, email: auth })

    return user
  } catch (error) {
    throw error
  }
}

const loginUser = async ({ email, password }) => {
  try {
    const user = await userDB.loginUser({ email, password })
    const token = generateToken({ user_id: user._id, email })
    console.log('login ________________')
    return { ...user, token }
  } catch (error) {
    throw error
  }
}

const verifyAccount = async ({ email, code }) => {
  try {
    // verify if account is already verified
    const existingUser = await userDB.checkIfEmailExists(email)
    if (!existingUser) throw createError('accountNotExist', null, 401)
    if (existingUser.verified) throw createError('alreadyVerified', null, 200)

    // check if otp is not present than send
    if (code === undefined) {
      const { code: otp, email: userEmail } = await saveOTP({ email })
      await sendOTP({ otp, email: userEmail })
      return { message: 'OTP sent successfully' }
    }

    // verify otp here
    await verifyOTP({ email, code })
    // TODO: take this code to data access layer
    const user = await User.findOneAndUpdate({ email }, { verified: true }, { new: true })
    return { message: 'Account verified', data: user }
  } catch (error) {
    console.error('Error verifying account:', error)
    throw error
  }
}

const forgotPassword = async ({ email }) => {
  try {
    const existingUser = await userDB.checkIfEmailExists(email)
    if (!existingUser) throw createError('accountNotExist', null, 401)

    const { code } = await saveOTP({ email, type: 'resetToken' })
    await sendOTP({ otp: code, email })
    return true
  } catch (error) {
    throw error
  }
}

const resetPassword = async ({ email, password, token }) => {
  try {
    await verifyOTP({ email, code: token, type: 'resetToken' })
    const user = await userDB.updateUser({ email, password })
    return { message: 'password reset success', data: user }
  } catch (error) {
    throw error
  }
}

module.exports = {
  createUser,
  loginUser,
  verifyAccount,
  forgotPassword,
  resetPassword,
}
