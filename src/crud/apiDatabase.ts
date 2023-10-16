import { type DeleteResult } from 'mongodb'
import { type Document, type Model } from 'mongoose' // Replace with the actual import
import AppError from '../utils/appError'
import httpStatus from 'http-status'

interface AllRecordsReturn {
  totalRecords: number
  records: Document[]
}
const getAllRecords = async (
  model: Model<Document>,
  userId: string,
  query: Record<string, any> = {}
): Promise<AllRecordsReturn> => {
  const { offset, size, sortConfig, searchQuery } = query
  const recordsPromise = model
    .find({ userId, ...searchQuery })
    .skip(offset)
    .limit(size)
    .sort(sortConfig)
    .populate('author genre')

  const totalRecordsPromise = model.countDocuments({ userId, ...searchQuery })
  const [records, totalRecords] = await Promise.all([recordsPromise, totalRecordsPromise])

  return {
    totalRecords,
    records
  }
}

const getOneRecord = async (
  model: Model<Document>,
  userId: string,
  recordId: string
): Promise<Document> => {
  const oneRecord = await model.findOne({ userId, _id: recordId })
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
  const createdRecord = await model.create({ ...record, userId })
  return createdRecord
}

const updateOneRecord = async (
  model: Model<Document>,
  userId: string,
  recordId: string,
  record: any
): Promise<Document> => {
  const updatedRecord = await model.findOneAndUpdate({ userId, _id: recordId }, record, {
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
  const deletedRecord = await model.findOneAndDelete({ userId, _id: recordId })
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
    userId,
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
