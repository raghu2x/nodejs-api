const bcrypt = require("bcryptjs"); // use for password encryption
const jwt = require("jsonwebtoken"); // use for generating auth token
const User = require("../schema/user"); // users schema

const { JWT_TOKEN_EXPIRY, JWT_TOKEN } = process.env;

// generate JWT token
const generateToken = (data) => {
  return jwt.sign(data, JWT_TOKEN, {
    expiresIn: JWT_TOKEN_EXPIRY,
  });
};

// create account
const createAccount = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const user = new User({
    firstName,
    lastName,
    email,
    password,
  });
  try {
    await user.validate(); //validate schema fields

    // validate if existing user
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      throw {
        message: `email already exist`,
      };
    }

    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // create user
    user = await User.create({
      ...user,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    user.token = generateToken({ user_id: user._id, email });
    res.status(201).send({
      success: true,
      message: "account created successfully",
      data: user,
    });
  } catch (error) {
    console.log("__________ an error", error);
    res
      .status(error.status || 400)
      .send({ success: false, message: error.message || error });
  }
};

// login account
const loginAccount = async (req, res) => {
  const { email, password } = req.body;
  try {
    await new User({ ...req.body }).validate(["email", "password"]); //validate feilds
    //find user
    const user = await User.findOne({ email });
    if (!user) {
      throw {
        message: `user not found with email ${email}`,
      };
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      //set token
      user.token = generateToken({ user_id: user._id, email });

      res.status(200).send({
        success: true,
        message: "login successfull",
        user,
      });
    } else {
      throw {
        success: false,
        message: "invalid password",
      };
    }
  } catch (error) {
    res
      .status(error.status || 400)
      .send({ success: false, message: error.message || error });
    console.log("____________", error);
  }
};

module.exports = {
  createAccount,
  loginAccount,
};
