import * as Joi from 'joi'

/**
 * one uppercase
 * one lowercase
 * one special character [#?!@$%^&*-]
 * one number
 * length between 8 - 30
 */
const passwordRegx = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,30}$/

const register = Joi.object({
  firstName: Joi.string().max(30).required(),
  lastName: Joi.string().max(30).required(),
  email: Joi.string().required().email(),
  password: Joi.string().pattern(passwordRegx).required(),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
})

const login = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required().max(30),
  remember: Joi.boolean()
})

const forgotPassword = Joi.object({
  email: Joi.string().required().email()
})

const resetPassword = Joi.object({
  email: Joi.string().email(),
  token: Joi.string().required().max(70),
  password: Joi.string().required().pattern(passwordRegx),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
})

const changePassword = Joi.object({
  email: Joi.string().email(),
  currentPassword: Joi.string().required(),
  password: Joi.string().required().pattern(passwordRegx),
  confirmPassword: Joi.string().required().valid(Joi.ref('password'))
})

export default { register, login, forgotPassword, resetPassword, changePassword }