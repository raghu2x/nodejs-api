import httpStatus from 'http-status'
import { type IUserModel, type IUser } from '../schema/user' // Update with the correct path and User type
import AppError from '../utils/appError'
import { compare, encrypt } from '../utils/authUtils'
import { createError } from '../utils/helper'
import { type UserRegistrationData, type LoginData } from '../utils/interfaces'

type UserFunction<T> = (data: T, model: IUserModel) => Promise<IUser>

const createAccount: UserFunction<UserRegistrationData> = async (userRegData, model) => {
  try {
    // 1. encrypt password
    userRegData.password = await encrypt(userRegData.password)

    // 2. create user
    const createdUser = await model.create(userRegData)
    const { password: userPassword, ...responseUser } = createdUser.toObject()

    return responseUser as IUser
  } catch (error) {
    throw model.checkDuplicateEmail(error)
  }
}

const loginUser: UserFunction<LoginData> = async ({ email, password }, model) => {
  const user: IUser = await model.get(email)

  if (!(await compare(password, user.password))) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Email or Password is wrong')
  }

  if (!user.verified) throw createError('notVerified', '', 401)

  const { password: userPassword, ...responseUser } = user.toObject()
  return responseUser as IUser
}

const updateUser: UserFunction<any> = async (payload, model) => {
  const { email, ...restdata } = payload

  if (payload.password !== undefined) {
    payload.password = await encrypt(payload.password)
  }

  const user = await model.findOneAndUpdate({ email }, restdata, { new: true })
  if (user == null) throw createError('emailNotExist', email, 401)

  const { password: userPassword, ...responseUser } = user.toObject()
  return responseUser as IUser
}

export default { createAccount, loginUser, updateUser }
