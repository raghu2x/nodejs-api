const router = require("express").Router();
const auth = require("../middleware/auth");
const testRoute = require("./test");
const authRouter = require("./authentication");
const booksRouter = require("./books");

router.use("/", testRoute);
router.use("/api/auth", authRouter);
router.use("/api/books", auth, booksRouter);

module.exports = router;
