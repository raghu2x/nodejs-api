import { type Response, type Request } from 'express'
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
  data?: Record<string, any>,
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

export const SendEndpointNotFoundResponse = (req: Request, res: Response): void => {
  const payload: Payload = {
    success: false,
    timestamp: new Date(),
    statusCode: httpStatus.NOT_FOUND,
    message: "Requested endpoint doesn't exist or method not allowed!"
  }
  res.status(httpStatus.NOT_FOUND).json(payload)
}

export const SendAccountCreatedResponse = (res: Response, data: any): void => {
  res.status(httpStatus.CREATED)

  res.send({
    success: true,
    timestamp: new Date(),
    statusCode: httpStatus.CREATED,
    message: 'Account created. Verify your email to continue.',
    data
  })
}

export const SendLoginResponse = (res: Response, data: Record<string, any>): void => {
  res.status(httpStatus.OK)

  res.send({
    success: true,
    timestamp: new Date(),
    statusCode: httpStatus.OK,
    message: 'Login successfull',
    data
  })
}
