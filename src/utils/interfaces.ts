import type { Request, NextFunction, Response } from 'express'
import type { JwtPayload } from 'jsonwebtoken'
import { type Connection } from 'mongoose'

/**
 * @deprecated - this is deprecated use import from 'types/common' instead
 */
export interface AuthenticatedUser extends JwtPayload {
  userId: string
  institutionName: string
  userType: 'staff' | 'admin' | 'student' | 'parent'
  email: string
}
/**
 * @deprecated - this is deprecated use import from 'types/common' instead
 */
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser // Use union type to make it flexible
  masterDb: Connection
  schoolDb: Connection
}

export interface UserRegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
  address?: string
}

export interface LoginData {
  institutionName: string
  userType: 'staff' | 'admin' | 'student' | 'parent'
  email: string
  password: string
  remember?: boolean
  userId?: string
}

export interface VerificationData {
  email: string
  code?: string
  otp?: string | number
}

export interface PasswordResetData {
  email: string
  password: string
  token: string
}
