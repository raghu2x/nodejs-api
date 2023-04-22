const router = require('express').Router()
const authController = require('../controllers/authController')

router.post('/login', authController.loginAccount)
router.post('/register', authController.createAccount)
// router.post('/send-otp', authController.sendOTP)
router.post('/send-email', authController.sendEmail)

module.exports = router
