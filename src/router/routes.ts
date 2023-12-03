import { Router, type Request, type Response } from 'express'
import { MAIL_SETTINGS } from '../config'
import { type AuthenticatedRequest } from 'utils/interfaces'

import { getDBModel } from '../database/connection'
import AppError from '../utils/appError'
import httpStatus from 'http-status'
import { sendErrorResponse, sendSuccessResponse } from '../utils/apiResponse'

const router: Router = Router()

router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'hey welcome to our app'
  })
})

router.get('/api/env', (req: Request, res: Response) => {
  console.log('email 18', MAIL_SETTINGS)
  res.status(200).json({
    success: true,
    message: 'hey welcome to our app',
    env: MAIL_SETTINGS
  })
})

router.get('/api/endpoints', (req: Request, res: Response) => {
  res.sendFile('resume.pdf', { root: 'public' }, function (err) {
    console.log(err)
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (err) res.status(500).json({ success: false, message: "couldn't find file" }) // send a 500 on error
  })
})

// const sendEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const OTP = generateOTP()
//   const data = { OTP, to: 'raghvendra4077@gmail.com' }
//   try {
//     await sendMail(data)
//     res.send({ success: true, message: 'Email sent' })
//   } catch (error) {
//     next(error)
//   }
// }

// router.post('/send-otp', authController.sendOTP)
// router.post('/send-email', authController.sendEmail)

// eslint-disable-next-line @typescript-eslint/no-misused-promises
router.post('/api/create-tenant', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const model = getDBModel(req.masterDb, 'tenant')
    const existingTenant = await model.findOne({ schoolId: req.body.schoolId })
    if (existingTenant != null) throw new AppError(httpStatus.CONFLICT, 'schoolId already exist')

    const data = await model.create(req.body)

    sendSuccessResponse(res, data, httpStatus.CREATED, 'Tenant created!')
  } catch (error) {
    sendErrorResponse(res, error.statusCode, error.message)
  }
})

export default router
