const { createError } = require('../utils/helper')

const getAllRecords = async (model, query = {}) => {
  const { offset, size, sortConfig, searchQuery } = query
  try {
    const allRecords = await model
      .find(searchQuery)
      .skip(offset)
      .limit(size)
      .sort(sortConfig)
      .populate('author genre')
    return {
      totalRecords: await model.count(searchQuery),
      records: allRecords,
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getOneRecord = async (model, recordId) => {
  try {
    const oneRecord = await model.findOne({ _id: recordId })
    if (!oneRecord) {
      throw createError(404, recordId)
    }
    return oneRecord
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createRecord = async (model, record) => {
  try {
    const createdRecord = await model.create(record)
    return createdRecord
  } catch (error) {
    throw error
  }
}

const updateOneRecord = async (model, recordId, record) => {
  try {
    const updatedRecord = await model.findByIdAndUpdate(recordId, record, { new: true })
    if (!updatedRecord) {
      throw createError(404, recordId)
    }
    return updatedRecord
  } catch (error) {
    throw error
  }
}

const deleteOneRecord = async (model, recordId) => {
  try {
    const deletedRecord = await model.findByIdAndDelete(recordId)
    if (!deletedRecord) {
      throw createError(404, recordId)
    }
    return deletedRecord
  } catch (error) {
    throw error
  }
}
const deleteManyRecords = async (model, recordIds) => {
  try {
    const deletedRecords = await model.deleteMany({ _id: { $in: recordIds } })
    return deletedRecords
  } catch (error) {
    throw error
  }
}

module.exports = {
  getAllRecords,
  getOneRecord,
  createRecord,
  updateOneRecord,
  deleteOneRecord,
  deleteManyRecords,
}
