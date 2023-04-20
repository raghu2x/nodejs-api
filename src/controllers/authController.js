const bcrypt = require('bcryptjs') // use for password encryption
const jwt = require('jsonwebtoken') // use for generating auth token
const User = require('../schema/user') // users schema

const { JWT_TOKEN_EXPIRY, JWT_TOKEN } = process.env

// generate JWT token
const generateToken = data => {
  return jwt.sign(data, JWT_TOKEN, {
    expiresIn: JWT_TOKEN_EXPIRY,
  })
}

// create account
const createAccount = async (req, res) => {
  const { firstName, lastName, email, password } = req.body
  let user = new User({
    firstName,
    lastName,
    email,
    password,
  })
  try {
    console.log('user validation_________')
    await user.validate() //validate schema fields
    // validate if existing user
    const oldUser = await User.findOne({ email })
    console.log('old user check_________')
    if (oldUser) {
      throw {
        message: `email already exist`,
      }
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(req.body.password, 10)
    console.log('encrypt password end_________')
    // create user
    user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    })

    user.token = generateToken({ user_id: user._id, email })
    const { password, ...responseUser } = user._doc
    res.status(201).send({
      success: true,
      message: 'account created successfully',
      data: responseUser,
    })
  } catch (error) {
    console.log('__________ an error')
    res.status(error.status || 400).send({ success: false, message: error.message || error })
  }
}

// login account
const loginAccount = async (req, res) => {
  const { email, password } = req.body
  try {
    await new User({ ...req.body }).validate('email') //validate feilds
    //find user
    const user = await User.findOneAndUpdate({ email }, { lastLog: new Date() }).select('+password')
    if (!user) {
      throw {
        message: `user not found with email ${email}`,
      }
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      //set token
      user.token = generateToken({ user_id: user._id, email })
      const { password, ...responseUser } = user._doc
      res.status(200).send({
        success: true,
        message: 'login successfull',
        data: responseUser,
      })
    } else {
      throw {
        success: false,
        message: 'invalid password',
      }
    }
  } catch (error) {
    res.status(error.status || 400).send({ success: false, message: error.message || error })
    console.log('____________', error)
  }
}

const getAllUsers = async (req, res) => {
  let allUsers = await User.find().populate('books')

  res.status(200).send({
    success: true,
    // message: "login successfull",
    rows: allUsers,
  })
}

const getOneUser = async (req, res) => {
  try {
    let oneUser = await User.findById(req.params.id).populate('books')
    // const books = await Book.find({ author: oneUser._id })
    res.status(200).send({
      success: true,
      data: oneUser,
      // books,
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message || error,
    })
    console.log('user have error_______________')
  }
}

module.exports = {
  createAccount,
  loginAccount,
  getAllUsers,
  getOneUser,
}
