const { v4: uuid } = require("uuid");
const Book = require("../database/Book");

const createNewBook = (book) => {
  const bookToInsert = {
    ...book,
    id: uuid(),
  };
  const createdBook = Book.createNewBook(bookToInsert);
  return createdBook;
};

const getAllBooks = () => {
  const allBooks = Book.getAllBooks();
  return allBooks;
};

const getOneBook = (bookId) => {
  const oneBook = Book.getOneBook(bookId);
  return oneBook;
};

const updateOneBook = (bookId, book) => {
  const bookToUpdate = {
    title: book.title,
  };
  const updatedBook = Book.updateOneBook(bookId, bookToUpdate);
  return updatedBook;
};

const deleteOneBook = (bookId) => {
  const deletedBook = Book.deleteOneBook(bookId);
  return deletedBook;
};

module.exports = {
  getAllBooks,
  getOneBook,
  updateOneBook,
  deleteOneBook,
  createNewBook,
};
