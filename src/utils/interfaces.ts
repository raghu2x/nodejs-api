import type { Request } from 'express'
import type { JwtPayload } from 'jsonwebtoken'

export interface AuthenticatedUser extends JwtPayload {
  userId: string
}
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser // Use union type to make it flexible
}

export interface UserRegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
  address?: string
}

export interface LoginData {
  email: string
  password: string
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
