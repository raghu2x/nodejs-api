import rateLimit from 'express-rate-limit'
import { sendErrorResponse } from './apiResponse'

// const handler = (req, res, next, options) => {
//   sendErrorResponse(res, options.statusCode, options.message)
// }

export const createAccountLimiter = rateLimit({
  handler(req, res, next, options) {
    sendErrorResponse(res, options.statusCode, options.message)
  },
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: 'Too many accounts created from this IP, please try again after an hour',
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})

export const apiLimiter = rateLimit({
  handler(req, res, next, options) {
    sendErrorResponse(res, options.statusCode, options.message)
  },
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 150,
  message: 'Too Many Request from this IP, please try again in an hour',
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false // Disable the `X-RateLimit-*` headers
})
