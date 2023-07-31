const { createError } = require('../utils/helper');

const getAllRecords = async (model, userId, query = {}) => {
  const {
    offset, size, sortConfig, searchQuery,
  } = query;
  try {
    const allRecords = await model
      .find({ userId, ...searchQuery })
      .skip(offset)
      .limit(size)
      .sort(sortConfig)
      .populate('author genre');
    return {
      totalRecords: await model.count({ userId, ...searchQuery }),
      records: allRecords,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getOneRecord = async (model, userId, recordId) => {
  try {
    const oneRecord = await model.findOne({ userId, _id: recordId });
    if (!oneRecord) {
      throw createError(404, recordId);
    }
    return oneRecord;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const createRecord = async (model, userId, record) => {
  const createdRecord = await model.create({ ...record, userId });
  return createdRecord;
};

const updateOneRecord = async (model, userId, recordId, record) => {
  const updatedRecord = await model.findOneAndUpdate(
    { userId, _id: recordId },
    record,
    {
      new: true,
    },
  );
  if (!updatedRecord) {
    throw createError(404, recordId);
  }
  return updatedRecord;
};

const deleteOneRecord = async (model, userId, recordId) => {
  const deletedRecord = await model.findOneDelete({ userId, _id: recordId });
  if (!deletedRecord) {
    throw createError(404, recordId);
  }
  return deletedRecord;
};
const deleteManyRecords = async (model, userId, recordIds) => {
  const deletedRecords = await model.deleteMany({
    userId,
    _id: { $in: recordIds },
  });
  return deletedRecords;
};

module.exports = {
  getAllRecords,
  getOneRecord,
  createRecord,
  updateOneRecord,
  deleteOneRecord,
  deleteManyRecords,
};
