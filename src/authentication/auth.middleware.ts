import type { Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { type AuthenticatedRequest, type AuthenticatedUser } from '../utils/interfaces'
import { sendErrorResponse } from 'utils/apiResponse'
import httpStatus from 'http-status'
import { getDBModel } from 'database/connection'

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const { JWT_TOKEN, HEADER_TOKEN_KEY } = process.env

  const tokenKey = HEADER_TOKEN_KEY ?? ''
  const token = req.cookies[tokenKey]

  console.log('_________________________ authenticating user')

  if (token !== undefined && typeof token === 'string') {
    try {
      const user = jwt.verify(token, JWT_TOKEN ?? '') as AuthenticatedUser
      const userModel = getDBModel(req.schoolDb, 'user')

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
