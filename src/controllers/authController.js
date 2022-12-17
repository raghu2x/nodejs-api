const bcrypt = require("bcryptjs"); // use for password encryption
const jwt = require("jsonwebtoken"); // use for generating auth token
const User = require("../schema/user"); // users schema

const { JWT_TOKEN_EXPIRY, JWT_TOKEN } = process.env;
// create account
const createAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    //validate fields
    if (!(firstName && lastName && email && password)) {
      res.status(400).send({
        success: false,
        message: "all fields is required",
      });
    }

    // validate if existing user
    const oldUser = await User.findOne({ email });
    // res.send(oldUser);
    if (oldUser) {
      console.log("____________ user found", oldUser);
      res.status(404).json({
        success: false,
        message: `user with email ${email} already exist`,
        // user: oldUser,
      });
    }

    console.log("________________before password encrypted");
    // encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);
    console.log("________________ password encrypted");
    //   create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: encryptedPassword,
    });

    //generate jwt token
    const token = jwt.sign({ user_id: user._id, email }, JWT_TOKEN, {
      expiresIn: JWT_TOKEN_EXPIRY,
    });
    user.token = token;
    res.status(201).json({
      success: true,
      message: "account created successfully",
      user,
    });
  } catch (error) {
    console.log("__________ an error", error);
    // res.status(500).send(error);
  }
};

// login account
const loginAccount = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({
      success: false,
      message: `user not found with email ${email}`,
    });
  }

  //generate jwt token
  const token = jwt.sign({ user_id: user._id, email }, JWT_TOKEN, {
    expiresIn: JWT_TOKEN_EXPIRY,
  });
  user.token = token;
  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      success: true,
      message: "login successfull",
      user,
    });
  } else {
    res.status(400).json({
      success: false,
      message: "invalid password",
    });
  }
};

module.exports = {
  createAccount,
  loginAccount,
};
