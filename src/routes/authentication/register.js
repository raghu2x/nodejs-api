const bcrypt = require("bcryptjs"); // use for password encryption
const jwt = require("jsonwebtoken"); // use for generating auth token
const express = require("express");
const router = express.Router();
const User = require("../../schema/user"); // users schema

router.post("/", async (req, res) => {
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

module.exports = router;
