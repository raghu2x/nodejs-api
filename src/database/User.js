const User = require('../schema/user')
const { compare, encrypt } = require('../utils/authUtils')
const { createError } = require('../utils/helper')
const checkIfEmailExists = async (email) => {
  const existingUser = await User.findOne({ email }).select('+password')
  if (existingUser) return existingUser
  return null
}

const createAccount = async ({ firstName, lastName, email, password }) => {
  const encryptedPassword = await encrypt(password)
  try {
    const existingUser = await checkIfEmailExists(email)
    if (existingUser) throw new Error('Account already exist')

    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword
    })
    const { password: userPassword, ...responseUser } = createdUser

    return responseUser
  } catch (error) {
    throw error
  }
}

const loginUser = async ({ email, password }) => {
  try {
    const user = await checkIfEmailExists(email)
    if (!user) throw createError('emailNotExist', email, 401)
    if (!user.verified) throw createError('notVerified', null, 401)

    const isPasswordMatch = await compare(password, user.password)
    if (!isPasswordMatch) throw createError('InvalidCred', null, 401)

    const { password: userPassword, ...responseUser } = user._doc
    return responseUser
  } catch (error) {
    console.log('user issue')
    throw error
  }
}

const updateUser = async ({ email, ...restdata }) => {
  const payload = { ...restdata }
  try {
    if (payload.password) {
      payload.password = await encrypt(payload.password)
    }
    const user = await User.findOneAndUpdate({ email }, payload, { new: true })
    if (!user) throw createError('emailNotExist', email, 401)

    const { password: userPassword, ...responseUser } = user._doc
    return responseUser
  } catch (error) {
    throw error
  }
}

module.exports = {
  createAccount,
  checkIfEmailExists,
  loginUser,
  updateUser
}
