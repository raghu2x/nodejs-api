import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken' // use for generating auth token
import * as bcrypt from 'bcryptjs'

const generateOTP = (otpLength: number = 6): number => {
  let OTP: number = 0
  const maxDigitValue: number = 9

  for (let i = 0; i < otpLength; i++) {
    const randomDigit: number = crypto.randomInt(0, maxDigitValue + 1)
    OTP = OTP * 10 + randomDigit // here lot of calc only for a number otp
  }

  return OTP
}

type TokenData = object | string | Buffer
// generate JWT token
const generateToken = (payload: TokenData): string => {
  const jwtToken: jwt.Secret = process.env.JWT_TOKEN ?? ''

  const options: jwt.SignOptions = {
    expiresIn: process.env.JWT_TOKEN_EXPIRY
  }

  return jwt.sign(payload, jwtToken, options)
}

/**
 * Encrypts a given value using bcrypt
 * @param {string} value - The value to encrypt
 * @param {number} [length=10] - The number of rounds of encryption to use (default: 10)
 * @returns {Promise<string>} - A promise that resolves to the encrypted value
 */
const encrypt = async (plaintext: string, length: number = 10): Promise<string> => {
  const encryptedValue = await bcrypt.hash(plaintext, length)
  return encryptedValue
}

/**
 * Compares two given values using bcrypt to determine if they match
 * @param {string} plaintext - The plaintext value to compare
 * @param {string} hash - The hash value to compare
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the values match
 */
const compare = async (plaintext: string, hash: string): Promise<boolean> => {
  const isSame = await bcrypt.compare(plaintext, hash)
  return isSame
}

const getResetToken = (length: number = 20, type: BufferEncoding = 'hex'): string => {
  const token = crypto.randomBytes(length).toString(type)
  return token
}

export { generateToken, generateOTP, encrypt, compare, getResetToken }
