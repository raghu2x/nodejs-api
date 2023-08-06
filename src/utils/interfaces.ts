export interface UserRegistrationData {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface VerificationData {
  email: string
  code?: string
  otp?: string | number
}

export interface PasswordResetData {
  email: string
  password: string
  token: string
}
