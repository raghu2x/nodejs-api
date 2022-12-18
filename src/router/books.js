const router = require("express").Router();
const booksController = require("../controllers/booksController");

router.post("/", booksController.createNewBook);

router.get("/", booksController.getAllBooks);

router.get("/:bookId", booksController.getOneBook);

router.put("/:bookId", booksController.updateOneBook);

router.delete("/:bookId", booksController.deleteOneBook);

module.exports = router;
