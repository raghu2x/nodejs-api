const { createError } = require('../utils/helper')

const getAllRecords = async (model, userId, query = {}) => {
  const { offset, size, sortConfig, searchQuery } = query
  try {
    const allRecords = await model
      .find({ userId, ...searchQuery })
      .skip(offset)
      .limit(size)
      .sort(sortConfig)
      .populate('author genre')
    return {
      totalRecords: await model.count({ userId, ...searchQuery }),
      records: allRecords,
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getOneRecord = async (model, userId, recordId) => {
  try {
    const oneRecord = await model.findOne({ userId, _id: recordId })
    if (!oneRecord) {
      throw createError(404, recordId)
    }
    return oneRecord
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createRecord = async (model, userId, record) => {
  try {
    const createdRecord = await model.create({ ...record, userId })
    return createdRecord
  } catch (error) {
    throw error
  }
}

const updateOneRecord = async (model, userId, recordId, record) => {
  try {
    const updatedRecord = await model.findOneAndUpdate({ userId, _id: recordId }, record, {
      new: true,
    })
    if (!updatedRecord) {
      throw createError(404, recordId)
    }
    return updatedRecord
  } catch (error) {
    throw error
  }
}

const deleteOneRecord = async (model, userId, recordId) => {
  try {
    const deletedRecord = await model.findOneDelete({ userId, _id: recordId })
    if (!deletedRecord) {
      throw createError(404, recordId)
    }
    return deletedRecord
  } catch (error) {
    throw error
  }
}
const deleteManyRecords = async (model, userId, recordIds) => {
  try {
    const deletedRecords = await model.deleteMany({ userId, _id: { $in: recordIds } })
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
