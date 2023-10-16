import { type Response } from 'express'
import httpStatus from 'http-status'

interface Payload {
  success: boolean
  timestamp: Date
  message?: string
  statusCode: number
  data?: Record<string, any>
  error?: Record<string, any>
}

export const sendSuccessResponse = (
  res: Response,
  data: Record<string, any>,
  statusCode: number = httpStatus.OK,
  message?: string
): void => {
  const payload: Payload = {
    success: true,
    timestamp: new Date(),
    data,
    message,
    statusCode
  }

  res.status(statusCode).send(payload)
}

export const sendErrorResponse = (
  res: Response,
  statusCode: number = httpStatus.INTERNAL_SERVER_ERROR,
  message: string,
  error?: any
): void => {
  const payload: Payload = {
    success: false,
    timestamp: new Date(),
    statusCode,
    message: message ?? httpStatus[statusCode],
    error
  }
  res.status(statusCode).json(payload)
}
