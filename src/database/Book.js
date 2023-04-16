const Book = require("../schema/book");

const getAllBooks = async ({ limit, offset }) => {
  try {
    const allBooks = await Book.find()
      .skip(offset * limit || 0)
      .limit(limit || 10).populate('author', 'firstName lastName');
    return {
      limit: limit || 10,
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
    const oneBook = await Book.findById(bookId).populate({
      path: 'author',
      select: 'firstName lastName fullName',
    });
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
    let isOldBook = await Book.findOne({ name: book.name }).populate('author', 'firstName lastName');
    if (isOldBook) {
      throw `book alredy exist`;
    }
    // create book
    const createdBook = await Book.create(book).populate('author', 'firstName lastName');
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
    return await Book.findById(bookId).populate('author', 'firstName lastName '); //TODO: Fix It
  } catch (error) {
    throw error;
  }
};

const deleteOneBook = async (bookId) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(bookId).populate('author', 'firstName lastName');
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
