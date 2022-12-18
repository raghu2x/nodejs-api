const { v4: uuid } = require("uuid");
const Book = require("../database/Book");

const createNewBook = async (book) => {
  const bookToInsert = {
    ...book,
    id: uuid(),
  };
  const createdBook = await Book.createNewBook(bookToInsert);
  return createdBook;
};

const getAllBooks = async (query) => {
  const allBooks = await Book.getAllBooks(query);
  return allBooks;
};

const getOneBook = async (bookId) => {
  const oneBook = await Book.getOneBook(bookId);
  return oneBook;
};

const updateOneBook = async (bookId, book) => {
  const bookToUpdate = {
    title: book.title,
  };
  const updatedBook = await Book.updateOneBook(bookId, bookToUpdate);
  console.log("________inside book service", updatedBook);
  return updatedBook;
};

const deleteOneBook = async (bookId) => {
  const deletedBook = await Book.deleteOneBook(bookId);
  return deletedBook;
};

module.exports = {
  getAllBooks,
  getOneBook,
  updateOneBook,
  deleteOneBook,
  createNewBook,
};
