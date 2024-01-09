import type { Request, NextFunction, Response } from 'express'
import type { JwtPayload } from 'jsonwebtoken'
import { type Connection } from 'mongoose'

/* =============== Express ================= */
export interface AuthenticatedUser extends JwtPayload {
  userId: string
  institutionName: string
  userType: 'staff' | 'admin' | 'student' | 'parent'
  email: string
}
export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser // Use union type to make it flexible
  masterDb: Connection
  schoolDb: Connection
}

export type CustomRequestHandler = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void> | void
