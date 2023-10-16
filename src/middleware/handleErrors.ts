import type { Request, Response, NextFunction } from 'express'
import { sendErrorResponse } from '../utils/apiResponse'
import type AppError from '../utils/appError'

const handleErrors = (err: AppError, req: Request, res: Response, next: NextFunction): void => {
  sendErrorResponse(res, err.statusCode, err.message)
}

export default handleErrors
