const router = require("express").Router();
const auth = require("../middleware/auth");
const booksController = require("../controllers/booksController");

router.post("/", booksController.createNewBook);

router.get("/", auth, booksController.getAllBooks);

router.get("/:id", auth, booksController.getOneBook);

router.put("/:id", auth, booksController.updateOneBook);

router.delete("/:id", booksController.deleteOneBook);

module.exports = router;
