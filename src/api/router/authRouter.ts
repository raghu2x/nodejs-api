import { Router } from 'express'
import authController from '@/api/controllers/coreController/authController'
import adminController from '@/api/controllers/coreController/adminController'

import { createAccountLimiter } from '@/utils/rateLimiter'

const router: Router = Router()
/* eslint-disable */

router.use('/register', createAccountLimiter)

router.post('/register', adminController.createAccount)
router.post('/verify-contact', adminController.verifyAccount)

router.post('/login', authController.loginAccount)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password', authController.resetPassword)

export default router
