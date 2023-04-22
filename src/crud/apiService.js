const db = require('./apiDatabase')
const { getPagination } = require('../utils/helper')
const create = async (model, record) => {
  try {
    const createdBook = await db.createRecord(model, record)
    return createdBook
  } catch (error) {
    throw error
  }
}

const getAll = async (model, query) => {
  const { page, size, offset, sortBy, ascending, sortConfig } = getPagination(query)
  // const searchQuery = queryBuilder(query.search)

  // console.log(searchQuery)

  try {
    const allRecords = await db.getAllRecords(model, { offset, size, sortConfig })
    return { page, size, sortBy, ascending, ...allRecords }
  } catch (error) {
    throw error
  }
}

const getOne = async (model, recordId) => {
  try {
    const data = await db.getOneRecord(model, recordId)
    return data
  } catch (error) {
    throw error
  }
}

const updateOne = async (model, recordId, record) => {
  try {
    const updatedData = await db.updateOneRecord(model, recordId, record)
    return updatedData
  } catch (error) {
    throw error
  }
}

const deleteOne = async (model, recordId) => {
  try {
    const deletedRecord = await db.deleteOneRecord(model, recordId)
    return deletedRecord
  } catch (error) {
    throw error
  }
}
const deleteManyRecords = async (model, recordIds) => {
  try {
    const deletedRecords = await db.deleteManyRecords(model, recordIds)
    return deletedRecords
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
  deleteManyRecords,
}
