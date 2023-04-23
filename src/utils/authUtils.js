const crypto = require('crypto')
const jwt = require('jsonwebtoken') // use for generating auth token
const bcrypt = require('bcryptjs')

const { JWT_TOKEN_EXPIRY, JWT_TOKEN } = process.env

function generateOTP() {
  const digits = '0123456789'
  let OTP = ''

  for (let i = 0; i < 6; i++) {
    OTP += digits[crypto.randomInt(0, 10)]
  }

  return OTP
}

// generate JWT token
const generateToken = data => {
  return jwt.sign(data, JWT_TOKEN, {
    expiresIn: JWT_TOKEN_EXPIRY,
  })
}

/**
 * Encrypts a given value using bcrypt
 * @param {string} value - The value to encrypt
 * @param {number} [length=10] - The number of rounds of encryption to use (default: 10)
 * @returns {Promise<string>} - A promise that resolves to the encrypted value
 */
const encrypt = async (plaintext, length = 10) => {
  const encryptedValue = await bcrypt.hash(plaintext, length)
  return encryptedValue
}

/**
 * Compares two given values using bcrypt to determine if they match
 * @param {string} plaintext - The plaintext value to compare
 * @param {string} hash - The hash value to compare
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the values match
 */
const compare = async (plaintext, hash) => {
  const isSame = await bcrypt.compare(plaintext, hash)
  return isSame
}

const getResetToken = (length = 20, type = 'hex') => {
  const token = crypto.randomBytes(length).toString(type)
  return token
}
module.exports = {
  generateToken,
  generateOTP,
  encrypt,
  compare,
  getResetToken,
}
