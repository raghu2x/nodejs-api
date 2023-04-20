const db = require('./apiDatabase')

const create = async (model, book) => {
  try {
    const createdBook = await db.createRecord(model, book)
    return createdBook
  } catch (error) {
    throw error
  }
}

const getAll = async (model, query) => {
  try {
    const data = await db.getAllRecords(model, query)
    return data
  } catch (error) {
    throw error
  }
}

const getOne = async (model, bookId) => {
  try {
    const data = await db.getOneRecord(model, bookId)
    return data
  } catch (error) {
    throw error
  }
}

const updateOne = async (model, bookId, book) => {
  try {
    const updatedData = await db.updateOneRecord(model, bookId, book)
    console.log('________inside book service', updatedData)
    return updatedData
  } catch (error) {
    throw error
  }
}

const deleteOne = async (model, bookId) => {
  try {
    const deletedData = await db.deleteOneRecord(model, bookId)
    return deletedData
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  create,
}
