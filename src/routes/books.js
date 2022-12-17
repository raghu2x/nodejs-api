const router = require("express").Router();
const booksController = require("../controllers/booksController");

router.post("/", booksController.createNewBook);

router.get("/", booksController.getAllBooks);

router.get("/:id", booksController.getOneBook);

router.put("/:id", booksController.updateOneBook);

router.delete("/:id", booksController.deleteOneBook);

module.exports = router;
