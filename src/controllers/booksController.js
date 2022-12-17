const booksServices = require("../services/booksServices");

const createNewBook = (req, res) => {
  const { title } = req.body;

  if (!title) {
    res.status(400).send({
      success: false,
      message: "title is require",
    });
  }

  const newBook = {
    title,
  };

  const createdBook = booksServices.createNewBook(newBook);

  if (!createdBook) {
    res.status(400).send({
      success: false,
      message: "book already exist",
    });
  } else {
    res.status(201).send({
      success: true,
      message: "added new book",
      data: createdBook,
    });
  }
};

const getAllBooks = (req, res) => {
  const allBooks = booksServices.getAllBooks();
  res.send({ success: true, rows: allBooks });
};

const getOneBook = (req, res) => {
  const { bookId } = req.params;
  const oneBook = booksServices.getOneBook(bookId);
  if (!oneBook) {
    res.status(404).send({
      success: false,
      message: `book not found with id ${bookId}`,
    });
  } else {
    res.status(404).send({
      success: true,
      data: oneBook,
    });
  }
};

const updateOneBook = (req, res) => {
  const { bookId } = req.params;
  const book = req.body;
  const updatedBook = booksServices.updateOneBook(bookId, book);
  if (!updatedBook) {
    res.status(404).send({
      success: false,
      message: `book not found with id ${bookId}`,
    });
  } else {
    res.send({ success: true, message: "updated Successfully", updatedBook });
  }
};

const deleteOneBook = (req, res) => {
  const { bookId } = req.params;
  const deletedBook = booksServices.deleteOneBook(bookId);

  if (!deletedBook) {
    res.status(404).send({
      success: false,
      message: `book not found with id ${bookId}`,
    });
  } else {
    res.send({ success: true, message: "Deleted Successfully", deletedBook });
  }
};

module.exports = {
  getAllBooks,
  getOneBook,
  updateOneBook,
  deleteOneBook,
  createNewBook,
};
