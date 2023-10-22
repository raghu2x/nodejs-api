import type { Request, Response, NextFunction } from 'express'
import { sendErrorResponse } from '../utils/apiResponse'
import type AppError from '../utils/appError'
import httpStatus from 'http-status'

interface IError extends AppError {
  isJoi: boolean
}
const handleErrors = (err: IError, req: Request, res: Response, next: NextFunction): void => {
  const statusCode: number = err.isJoi
    ? httpStatus.BAD_REQUEST
    : err.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR

  sendErrorResponse(res, statusCode, err.message)
}

export default handleErrors
