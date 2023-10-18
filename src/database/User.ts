import httpStatus from 'http-status'
import User, { type IUser } from '../schema/user' // Update with the correct path and User type
import AppError from '../utils/appError'
import { compare, encrypt } from '../utils/authUtils'
import { createError } from '../utils/helper'
import { type UserRegistrationData, type LoginData } from '../utils/interfaces'

const createAccount = async ({
  firstName,
  lastName,
  email,
  password
}: UserRegistrationData): Promise<IUser> => {
  try {
    const encryptedPassword = await encrypt(password)

    const createdUser = await User.create({
      firstName,
      lastName,
      email,
      password: encryptedPassword
    })
    const { password: userPassword, ...responseUser } = createdUser.toObject()

    return responseUser as IUser
  } catch (error) {
    throw User.checkDuplicateEmail(error)
  }
}

const loginUser = async ({ email, password }: LoginData): Promise<IUser> => {
  const user = await User.get(email)

  if (!(await compare(password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Email or Password is wrong')
  }

  if (!user.verified) throw createError('notVerified', '', 401)

  const { password: userPassword, ...responseUser } = user.toObject()
  return responseUser as IUser
}

const updateUser = async (payload: any): Promise<IUser> => {
  const { email, ...restdata } = payload

  if (payload.password !== undefined) {
    payload.password = await encrypt(payload.password)
  }
  const user = await User.findOneAndUpdate({ email }, restdata, { new: true })
  if (user == null) throw createError('emailNotExist', email, 401)

  const { password: userPassword, ...responseUser } = user.toObject()
  return responseUser as IUser
}

export default { createAccount, loginUser, updateUser }
