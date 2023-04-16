const booksServices = require("../services/booksServices");

const createNewBook = async (req, res) => {
  try {
    const createdBook = await booksServices.createNewBook(req.body);
    res.status(201).send({
      success: true,
      message: "added new book",
      data: createdBook,
    });
  } catch (error) {
    console.log("___________", error);
    res.status(error.status || 400).send({
      success: false,
      message: error.message || error,
    });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const allBooks = await booksServices.getAllBooks(req.query);
    res.send({ success: true, ...allBooks });
  } catch (error) {
    res.status(error.status || 400).send({
      success: false,
      message: error.message || error,
    });
  }
};

const getOneBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const oneBook = await booksServices.getOneBook(bookId);
    res.status(200).send({
      success: true,
      data: oneBook,
    });
  } catch (error) {
    res.status(error.status || 400).send({
      success: false,
      message: error.message || error,
    });
  }
};

const updateOneBook = async (req, res) => {
  const { bookId } = req.params;
  const book = req.body;
  try {
    const updatedBook = await booksServices.updateOneBook(bookId, book);
    res.send({ success: true, message: "updated Successfully", updatedBook });
  } catch (error) {
    res.status(error.status || 400).send({
      success: false,
      message: error.message || error,
    });
  }
};

const deleteOneBook = async (req, res) => {
  const { bookId } = req.params;
  try {
    const deletedBook = await booksServices.deleteOneBook(bookId);
    res.send({ success: true, message: "Deleted Successfully", deletedBook });
  } catch (error) {
    res.status(error.status || 400).send({
      success: false,
      message: error.message || error,
    });
  }
};

module.exports = {
  getAllBooks,
  getOneBook,
  updateOneBook,
  deleteOneBook,
  createNewBook,
};
