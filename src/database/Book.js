const DB = require("./db.json");
const { saveToDB } = require("../database/utils");
const Book = require("../schema/book");
const getAllBooks = async ({ limit, offset }) => {
  console.log("__________finding books");
  const allBooks = await Book.find()
    .skip(offset * limit || 0)
    .limit(limit || 5);
  return {
    limit: limit || 5,
    offset: offset || 0,
    count: await Book.count(),
    rows: await allBooks,
  };
};

const getOneBook = async (bookId) => {
  const oneBook = await Book.findById(bookId);
  return oneBook;
};

const createNewBook = async (book) => {
  let isOldBook = await Book.findOne({ title: book.title });

  if (isOldBook) return;
  const createdBook = await Book.create(book);
  return createdBook;
};

const updateOneBook = async (bookId, book) => {
  try {
    await Book.findByIdAndUpdate(bookId, book);
    return await Book.findById(bookId);
  } catch (error) {
    return;
  }
};

const deleteOneBook = async (bookId) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    return await deletedBook;
  } catch (error) {
    return;
  }
};
module.exports = {
  getAllBooks,
  getOneBook,
  createNewBook,
  updateOneBook,
  deleteOneBook,
};
