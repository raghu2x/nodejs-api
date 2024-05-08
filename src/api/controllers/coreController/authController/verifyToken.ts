import { verify } from 'jsonwebtoken'
import { sendErrorResponse } from '@/utils/apiResponse'
import httpStatus from 'http-status'
import { env } from '@/utils/env'
import { type CustomRequestHandler, type AuthenticatedUser } from '@/types/common'

const verifyToken: CustomRequestHandler = (req, res, next) => {
  const token: string = req.cookies[env('HEADER_TOKEN_KEY')]

  console.log('🤞 authenticating user')

  if (token !== undefined) {
    try {
      const user = verify(token, env('JWT_TOKEN')) as AuthenticatedUser

      req.user = user
      next()
    } catch (error) {
      sendErrorResponse(res, httpStatus.UNAUTHORIZED, 'Invalid Token!')
    }
  } else {
    sendErrorResponse(res, httpStatus.UNAUTHORIZED, 'Authentication Token required')
  }
}

export default verifyToken
