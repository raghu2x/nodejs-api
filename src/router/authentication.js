const router = require("express").Router();
const authController = require("../controllers/authController");

router.post("/login", authController.loginAccount);
router.post("/register", authController.createAccount);

router.get("/users", authController.getAllUsers);
router.get("/users/:id", authController.getOneUser);

module.exports = router;
