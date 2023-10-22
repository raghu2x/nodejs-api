import type { Response, NextFunction } from 'express'
import * as jwt from 'jsonwebtoken'
import { type AuthenticatedRequest, type AuthenticatedUser } from '../utils/interfaces'

const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const { JWT_TOKEN, HEADER_TOKEN_KEY } = process.env

  const tokenKey = HEADER_TOKEN_KEY ?? ''
  const token = req.cookies[tokenKey]

  console.log('_________________________ authenticating user')

  if (token !== undefined && typeof token === 'string') {
    try {
      const user = jwt.verify(token, JWT_TOKEN ?? '') as AuthenticatedUser
      req.user = user
      next()
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Invalid token'
      })
    }
  } else {
    res.status(403).json({
      status: false,
      message: 'authentication token required'
    })
  }
}

export default verifyToken
