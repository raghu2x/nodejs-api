const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/login", authController.loginAccount);

router.post("/register", authController.createAccount);

module.exports = router;
