const DB = require("./db.json");
const { saveToDB } = require("../database/utils");

const getAllBooks = () => {
  return DB.books;
};

const getOneBook = (bookId) => {
  let book = DB.books.find((x) => x.id === bookId);
  return book;
};

const createNewBook = (book) => {
  const isOldBook = DB.books.find((x) => x.title === book.title);

  if (isOldBook) return;

  DB.books.push(book);
  saveToDB(DB);
  return book;
};

const updateOneBook = (bookId, book) => {
  let bookIndex = DB.books.findIndex((x) => x.id == bookId);

  if (bookIndex === -1) return;
  DB.books[bookIndex] = { ...DB.books[bookIndex], ...book };
  saveToDB(DB);
  return DB.books[bookIndex];
};

const deleteOneBook = (bookId) => {
  let bookIndex = DB.books.findIndex((x) => x.id == bookId);
  if (bookIndex === -1) return;

  const deletedBook = DB.books.splice(bookIndex, 1);
  saveToDB(DB);
  return deletedBook;
};

module.exports = {
  getAllBooks,
  getOneBook,
  createNewBook,
  updateOneBook,
  deleteOneBook,
};
