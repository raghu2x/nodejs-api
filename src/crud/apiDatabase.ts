import { type DeleteResult } from 'mongodb'
import { type Document, type Model } from 'mongoose'
import AppError from '../utils/appError'
import httpStatus from 'http-status'
import APIFeatures from '../utils/apiFeature'
import { queryBuilder, type PaginationQuery, type Query } from '../utils/helper'

interface AllRecordsReturn {
  totalRecords: number
  records: Document[]
  pagination: PaginationQuery
}

const getAllRecords = async (
  model: Model<Document>,
  userId: string,
  query: Query
): Promise<AllRecordsReturn> => {
  const searchQuery = queryBuilder(query.search)

  const recordsPromise = new APIFeatures(model.find({ ...searchQuery }), query).sort().paginate()

  const totalRecordsPromise = model.countDocuments({ ...searchQuery })
  const [records, totalRecords] = await Promise.all([recordsPromise.query, totalRecordsPromise])

  return {
    pagination: recordsPromise.pagination,
    totalRecords,
    records
  }
}

const getOneRecord = async (
  model: Model<Document>,
  userId: string,
  recordId: string
): Promise<Document> => {
  const oneRecord = await model.findOne({ _id: recordId })
  if (oneRecord == null) {
    throw new AppError(httpStatus.NOT_FOUND, 'Record not found!')
  }
  return oneRecord
}

const createRecord = async (
  model: Model<Document>,
  userId: string,
  record: any
): Promise<Document> => {
  const createdRecord = await model.create({ ...record })
  return createdRecord
}

const updateOneRecord = async (
  model: Model<Document>,
  userId: string,
  recordId: string,
  record: Document
): Promise<Document> => {
  const updatedRecord = await model.findOneAndUpdate({ _id: recordId }, record, {
    new: true
  })
  if (updatedRecord == null) {
    throw new AppError(httpStatus.NOT_FOUND, 'Record not found!')
  }
  return updatedRecord
}

const deleteOneRecord = async (
  model: Model<Document>,
  userId: string,
  recordId: string
): Promise<Document> => {
  const deletedRecord = await model.findOneAndDelete({ _id: recordId })
  if (deletedRecord !== null) {
    return deletedRecord
  }

  throw new AppError(httpStatus.NOT_FOUND, 'Record not found!')
}

const deleteManyRecords = async (
  model: Model<Document>,
  userId: string,
  recordIds: string[]
): Promise<DeleteResult> => {
  const deletedRecords = await model.deleteMany({
    _id: { $in: recordIds }
  })
  return deletedRecords
}

export default {
  getAllRecords,
  getOneRecord,
  createRecord,
  updateOneRecord,
  deleteOneRecord,
  deleteManyRecords
}
