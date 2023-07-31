const db = require('./apiDatabase');
const { getPagination, queryBuilder } = require('../utils/helper');
const create = async (model, userId, record) => {
  try {
    const createdBook = await db.createRecord(model, userId, record);
    return createdBook;
  } catch (error) {
    throw error;
  }
};

const getAll = async (model, userId, query) => {
  const { page, size, offset, sortBy, ascending, sortConfig } =
    getPagination(query);
  const searchQuery = queryBuilder(query.search);

  console.log(searchQuery);

  try {
    const allRecords = await db.getAllRecords(model, userId, {
      offset,
      size,
      sortConfig,
      searchQuery,
    });
    return { page, size, sortBy, ascending, ...allRecords };
  } catch (error) {
    throw error;
  }
};

const getOne = async (model, userId, recordId) => {
  const data = await db.getOneRecord(model, userId, recordId);
  return data;
};

const updateOne = async (model, userId, recordId, record) => {
  try {
    const updatedData = await db.updateOneRecord(
      model,
      userId,
      recordId,
      record
    );
    return updatedData;
  } catch (error) {
    throw error;
  }
};

const deleteOne = async (model, userId, recordId) => {
  try {
    const deletedRecord = await db.deleteOneRecord(model, userId, recordId);
    return deletedRecord;
  } catch (error) {
    throw error;
  }
};
const deleteManyRecords = async (model, userId, recordIds) => {
  try {
    const deletedRecords = await db.deleteManyRecords(model, userId, recordIds);
    return deletedRecords;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAll,
  getOne,
  updateOne,
  deleteOne,
  create,
  deleteManyRecords,
};
