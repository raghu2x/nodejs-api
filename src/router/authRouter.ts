import { Router } from 'express'
import authController from '../authentication/authController'

const router: Router = Router()
/* eslint-disable */
router.post('/login', authController.loginAccount)
router.post('/register', authController.createAccount)
router.post('/verify-contact', authController.verifyAccount)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

export default router
