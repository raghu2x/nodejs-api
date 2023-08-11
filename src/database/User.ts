import User, { type UserType } from '../schema/user' // Update with the correct path and User type
import { compare, encrypt } from '../utils/authUtils'
import { createError } from '../utils/helper'
import { type UserRegistrationData, type LoginData } from '../utils/interfaces'

const checkIfEmailExists = async (email: string): Promise<UserType | null> => {
  const existingUser = await User.findOne({ email }).select('+password')
  if (existingUser != null) return existingUser
  return null
}

const createAccount = async ({
  firstName,
  lastName,
  email,
  password
}: UserRegistrationData): Promise<UserType> => {
  const encryptedPassword = await encrypt(password)

  const existingUser = await checkIfEmailExists(email)
  if (existingUser != null) throw new Error('Account already exists')

  const createdUser = await User.create({
    firstName,
    lastName,
    email,
    password: encryptedPassword
  })
  const { password: userPassword, ...responseUser } = createdUser.toObject()

  return responseUser as UserType
}

const loginUser = async ({ email, password }: LoginData): Promise<UserType> => {
  const user = await checkIfEmailExists(email)
  if (user == null) throw createError('emailNotExist', email, 401)
  if (!user.verified) throw createError('notVerified', '', 401)

  const isPasswordMatch = await compare(password, user.password)
  if (!isPasswordMatch) throw createError('InvalidCred', '', 401)

  const { password: userPassword, ...responseUser } = user.toObject()
  return responseUser as UserType
}

const updateUser = async ({
  email,
  ...restdata
}: {
  email: string
  [key: string]: any
}): Promise<UserType> => {
  const payload = { ...restdata }

  if (payload.password !== undefined) {
    payload.password = await encrypt(payload.password)
  }
  const user = await User.findOneAndUpdate({ email }, payload, { new: true })
  if (user == null) throw createError('emailNotExist', email, 401)

  const { password: userPassword, ...responseUser } = user.toObject()
  return responseUser as UserType
}

export default { createAccount, checkIfEmailExists, loginUser, updateUser }
