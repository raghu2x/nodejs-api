require("dotenv").config();
require("./config/database").connect();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const express = require("express");
const User = require("./schema/user");
const auth = require("./auth");
const app = express();

app.use(express.json());

app.get("/api/welcome", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "welcome to the world of bakloli",
  });
});

app.post("/api/register", async (req, res) => {
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
    const token = jwt.sign(
      { user_id: user._id, email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "2h",
      }
    );
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
});
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(400).json({
      success: false,
      message: `user not found with email ${email}`,
    });
  }

  //generate jwt token
  const token = jwt.sign({ user_id: user._id, email }, process.env.TOKEN_KEY, {
    expiresIn: "2h",
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
});
module.exports = app;
