const Book = require("../schema/book");

const getAllBooks = async ({ limit, offset }) => {
  try {
    const allBooks = await Book.find()
      .skip(offset * limit || 0)
      .limit(limit || 5);
    return {
      limit: limit || 5,
      offset: offset || 0,
      count: await Book.count(),
      rows: allBooks,
    };
  } catch (error) {
    throw error;
  }
};

const getOneBook = async (bookId) => {
  try {
    const oneBook = await Book.findById(bookId);
    if (!oneBook) {
      throw `book not found with id: ${bookId}`;
    }
    return oneBook;
  } catch (error) {
    console.log("error book not found");
    throw error;
  }
};

const createNewBook = async (book) => {
  try {
    let isOldBook = await Book.findOne({ title: book.title });
    if (isOldBook) {
      throw `book alredy exist`;
    }
    // create book
    const createdBook = await Book.create(book);
    return createdBook;
  } catch (error) {
    throw error;
  }
};

const updateOneBook = async (bookId, book) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(bookId, book);
    if (!updatedBook) {
      throw `book not found with id ${bookId}`;
    }
    return await Book.findById(bookId); //TODO: Fix It
  } catch (error) {
    throw error;
  }
};

const deleteOneBook = async (bookId) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (deletedBook) {
      throw `book not found with Id: ${bookId}`;
    }
    return deletedBook;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getAllBooks,
  getOneBook,
  createNewBook,
  updateOneBook,
  deleteOneBook,
};
