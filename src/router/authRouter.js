const router = require('express').Router()
const authController = require('../controllers/authController')

router.post('/login', authController.loginAccount)
router.post('/register', authController.createAccount)
// router.post('/send-otp', authController.sendOTP)
router.post('/send-email', authController.sendEmail)
router.post('/verify-contact', authController.verifyAccount)
router.post('/forgot-password', authController.forgotPassword)
router.post('/reset-password/:token', authController.resetPassword)

module.exports = router
