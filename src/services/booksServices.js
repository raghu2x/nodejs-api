const { v4: uuid } = require("uuid");
const Book = require("../database/Book");

const createNewBook = async (book) => {
  const bookToInsert = {
    ...book,
    id: uuid(),
  };
  try {
    const createdBook = await Book.createNewBook(bookToInsert);
    return createdBook;
  } catch (error) {
    throw new Error(error);
  }
};

const getAllBooks = async (query) => {
  try {
    const allBooks = await Book.getAllBooks(query);
    return allBooks;
  } catch (error) {
    throw new Error(error);
  }
};

const getOneBook = async (bookId) => {
  try {
    const oneBook = await Book.getOneBook(bookId);
    return oneBook;
  } catch (error) {
    throw new Error(error);
  }
};

const updateOneBook = async (bookId, book) => {
  const bookToUpdate = {
    title: book.title,
  };

  try {
    const updatedBook = await Book.updateOneBook(bookId, bookToUpdate);
    console.log("________inside book service", updatedBook);
    return updatedBook;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteOneBook = async (bookId) => {
  try {
    const deletedBook = await Book.deleteOneBook(bookId);
    return deletedBook;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  getAllBooks,
  getOneBook,
  updateOneBook,
  deleteOneBook,
  createNewBook,
};
