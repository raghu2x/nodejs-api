import { loginAccount } from '@/api/controllers/coreController/authController/signIn'
import createAccount from '@/api/controllers/coreController/adminController/create'
import forgotPassword from './forgot-password'
import resetPassword from './reset-password'

export default {
  createAccount,
  loginAccount,
  forgotPassword,
  resetPassword
}
