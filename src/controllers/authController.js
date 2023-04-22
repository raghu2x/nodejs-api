const User = require('../schema/user') // users schema
const { generateToken, generateOTP, compare, encrypt } = require('../utils/authUtils')

const { sendMail } = require('../services/sendEmail')
// create account

const findUserByEmail = async email => {
  const user = await User.findOne({ email })
  if (!user) return false

  return user
}

const createAccount = async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  const user = new User({
    firstName,
    lastName,
    email,
    password,
  })
  try {
    await user.validate() //validate schema fields
    const oldUser = await findUserByEmail(email)

    if (oldUser) {
      throw new Error('Email already registered')
    }

    // encrypt password
    const encryptedPassword = await encrypt(password)
    // create user
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    })

    const token = generateToken({ user_id: newUser._id, email })
    const { password: userPassword, ...responseUser } = newUser._doc
    res.status(201).send({
      success: true,
      message: 'Account created successfully',
      data: responseUser,
      token: token,
    })
  } catch (error) {
    console.error('Error occurred while creating account:', error)
    res.status(error.status || 400).send({ success: false, message: error.message || error })
  }
}

// login account
const loginAccount = async (req, res) => {
  const { email, password } = req.body
  try {
    await new User({ ...req.body }).validate('email') //validate fields
    //find user
    const user = await User.findOneAndUpdate({ email }, { lastLog: new Date() }).select('+password')
    if (!user) {
      throw {
        status: 401,
        message: `User not found with email ${email}`,
      }
    }

    const isPasswordMatch = await compare(password, user.password)

    if (!isPasswordMatch) {
      throw {
        status: 401,
        message: 'Invalid email or password. Please try again.',
      }
    }

    const token = generateToken({ user_id: user._id, email })

    const { password: userPassword, ...responseUser } = user._doc

    res.status(200).send({
      success: true,
      message: 'login successfull',
      data: responseUser,
      token,
    })
  } catch (error) {
    res.status(error.status || 400).send({ success: false, message: error.message || error })
  }
}

const sendEmail = async (req, res) => {
  const OTP = generateOTP()
  const data = { OTP, to: 'raghvendra4077@gmail.com' }
  try {
    await sendMail(data)
    res.send({ success: true, message: 'Email send' })
  } catch (error) {
    res.send({ message: error || 'error' })
  }
}

module.exports = {
  createAccount,
  loginAccount,
  sendEmail,
}
