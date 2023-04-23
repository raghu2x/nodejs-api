const User = require('../schema/user') // users schema
const { generateToken, compare } = require('../utils/authUtils')
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

const verifyAccount = async ({ email, otp }) => {
  try {
    // verify if account is already verified
    const existingUser = await userDB.checkIfEmailExists(email)
    if (!existingUser) throw createError('accountNotExist', null, 401)
    if (existingUser.verified) throw createError('alreadyVerified', null, 200)

    // check if otp is not present than send
    if (otp === undefined) {
      const { otp, auth } = await saveOTP({ email })
      await sendOTP({ otp, email: auth })
      return { message: 'OTP sent successfully' }
    }

    // verify otp here
    await verifyOTP({ email, otp })
    const user = await User.findOneAndUpdate({ email }, { verified: true })
    return { message: 'Account verified', data: user }
  } catch (error) {
    console.error('Error verifying account:', error)
    throw error
  }
}
module.exports = {
  createUser,
  loginUser,
  verifyAccount,
}
