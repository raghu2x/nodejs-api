const DB = require("../database/db.json");
const { saveToDB } = require("../database/utils");
let id = 5;
const createNewBook = (req, res) => {
  if (!req.body.title) {
    res.status(400).send({
      success: false,
      message: "invalid book title",
    });
  }
  //save to DB
  let book = { title: req.body.title, id: ++id };
  DB.push(book);
  saveToDB(DB);
  res.send({
    success: true,
    message: "added new book",
    book,
  });
};

const getAllBooks = (req, res) => {
  res.send(DB);
};

const getOneBook = (req, res) => {
  let book = DB.find((book) => book.id == req.params.id);
  if (!book) {
    res.status(404).send({
      success: false,
      message: `book not found with id ${req.params.id}`,
    });
  }
  res.send(book);
};

const updateOneBook = (req, res) => {
  let book = DB.find((book) => book.id == req.params.id);
  if (!book) {
    res.status(404).send({
      success: false,
      message: `book not found with id ${req.params.id}`,
    });
  }
  book.title = req.body.title;
  res.send({ success: true, message: "updated Successfully", book });
};

const deleteOneBook = (req, res) => {
  let book = DB.find((book) => book.id == req.params.id);
  if (!book) {
    res.status(404).send({
      success: false,
      message: `book not found with id ${req.params.id}`,
    });
  }

  res.send({ success: true, message: "Deleted Successfully", book });
};

module.exports = {
  getAllBooks,
  getOneBook,
  updateOneBook,
  deleteOneBook,
  createNewBook,
};
