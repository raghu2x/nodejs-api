import { loginAccount } from './signIn'
import createAccount from '@/api/adminController/create'
import verifyAccount from '@/api/adminController/verify'
import forgotPassword from '@/api/adminController/forgot-password'
import resetPassword from '@/api/adminController/reset-password'

export default {
  createAccount,
  loginAccount,
  verifyAccount,
  forgotPassword,
  resetPassword
}
