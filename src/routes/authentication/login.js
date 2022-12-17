const bcrypt = require("bcryptjs"); // use for password encryption
const jwt = require("jsonwebtoken"); // use for generating auth token
const express = require("express");
const router = express.Router();
const User = require("../../schema/user"); // users schema

router.post("/", async (req, res) => {
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

module.exports = router;
