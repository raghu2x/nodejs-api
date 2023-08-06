import { Router } from 'express'
import authController from '../controllers/authController'

const router: Router = Router()
/* eslint-disable */
router.post('/login', authController.loginAccount)
router.post('/register', authController.createAccount)
// router.post('/send-otp', authController.sendOTP)
router.post('/send-email', authController.sendEmail)
router.post('/verify-contact', authController.verifyAccount)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)

export default router
