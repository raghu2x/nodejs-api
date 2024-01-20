import { generateToken } from '@/utils/authUtils'
import type { LoginData } from '@/utils/interfaces'
import { type SignOptions } from 'jsonwebtoken'
import AppError from '@/utils/appError'
import httpStatus from 'http-status'

/**
 * This function will be used for authenticate : student|staff|parent
 * @param userData - LoginReq data
 * @param model - user model
 * @returns
 */
const userLogin = async (userData: LoginData, model): Promise<any> => {
  const { remember, institutionName, userId, userType, password } = userData

  const user = await model.findOne({
    'loginDetail.password': password,
    'loginDetail.id': userId
  })

  if (user === null) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'userId or password is wrong.')
  }

  const { loginDetail, ...responseUser } = user.toObject()

  const jwtOptions: SignOptions = {
    expiresIn: remember === true ? '36h' : process.env.JWT_TOKEN_EXPIRY
  }

  const tokenPayload = {
    userId: user._id,
    userType,
    institutionName
  }
  const token = generateToken(tokenPayload, jwtOptions)

  console.log('👍 User verified login In.')

  return { ...responseUser, token }
}

export default userLogin
