import type { Request, Response, NextFunction } from 'express'

// Define a custom error class that extends Error
class CustomError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

interface ErrorResponse {
  success: boolean
  error: string
}

const handleErrors = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode ?? 500
  const message = err.message ?? 'Internal Server Error'
  const errorResponse: ErrorResponse = {
    success: false,
    error: message
  }

  res.status(statusCode).json(errorResponse)
}

export default handleErrors
