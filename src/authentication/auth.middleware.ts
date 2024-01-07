import type { Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { type AuthenticatedRequest, type AuthenticatedUser } from '../utils/interfaces'
import { sendErrorResponse } from '../utils/apiResponse'
import httpStatus from 'http-status'
import { getDBModel } from '../database/connection'
import { env } from '../utils/env'

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const token: string = req.cookies[env('HEADER_TOKEN_KEY')]

  console.log('🤞 authenticating user')

  if (token !== undefined) {
    try {
      const user = jwt.verify(token, env('JWT_TOKEN')) as AuthenticatedUser
      // const userModel = getDBModel(req.schoolDb, 'user')

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
