const { createError } = require('../utils/helper')

const getAllRecords = async (model, query = {}) => {
  const { page = 1, size = 100, sortBy, ascending } = query
  const offset = (page - 1) * size
  const isAscending = ascending === 'true'

  const sortFun = () => {
    if (!sortBy) return {}
    return { [sortBy]: isAscending ? 1 : -1 }
  }
  try {
    const allRecords = await model
      .find()
      .skip(offset)
      .limit(size)
      .sort(sortFun())
      .populate('author')
    return {
      size,
      page,
      sortBy,
      ascending: isAscending,
      totalRecords: await model.count(),
      records: allRecords,
    }
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getOneRecord = async (model, recordId) => {
  try {
    const oneRecord = await model.findById(recordId)
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
    // let isOldRecord = await model.findOne()
    // if (isOldRecord) {
    //   throw `record alredy exist`
    // }
    // create record
    const createdRecord = await model.create(record)
    return createdRecord
  } catch (error) {
    throw error
  }
}

const updateOneRecord = async (model, recordId, record) => {
  try {
    const updatedRecord = await model.findByIdAndUpdate(recordId, record)
    if (!updatedRecord) {
      throw createError(404, recordId)
    }
    return await model.findById(recordId)
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

module.exports = {
  getAllRecords,
  getOneRecord,
  createRecord,
  updateOneRecord,
  deleteOneRecord,
}
