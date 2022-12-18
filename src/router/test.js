const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "welcome to the world of bakloli",
  });
});
router.get("/welcome", (req, res) => {
  res.status(200).json({
    success: true,
    message: "welcome to the world of bakloli",
  });
});

module.exports = router;
