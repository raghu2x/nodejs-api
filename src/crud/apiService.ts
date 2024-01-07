import db from './apiDatabase'
import { type Query, type PaginationQuery } from '../utils/helper'
import { type Document, type Model } from 'mongoose' // Replace with the actual import
import { type DeleteResult } from 'mongodb'

interface AllRecords extends PaginationQuery {
  totalRecords: number
  records: any[]
}

const create = async (model: Model<Document>, userId: string, record: any): Promise<any> => {
  const createdRecord = await db.createRecord(model, userId, record)
  return createdRecord
}

const getAll = async (
  model: Model<Document>,
  userId: string,
  query: Query
): Promise<AllRecords> => {
  const allRecords = await db.getAllRecords(model, userId, query)
  return allRecords
}

const getOne = async (model: Model<Document>, userId: string, recordId: string): Promise<any> => {
  const data = await db.getOneRecord(model, userId, recordId)
  return data
}

const updateOne = async (
  model: Model<Document>,
  userId: string,
  recordId: string,
  record: Document
): Promise<any> => {
  const updatedData = await db.updateOneRecord(model, userId, recordId, record)
  return updatedData
}

const deleteOne = async (
  model: Model<Document>,
  userId: string,
  recordId: string
): Promise<any> => {
  const deletedRecord = await db.deleteOneRecord(model, userId, recordId)
  return deletedRecord
}

const deleteManyRecords = async (
  model: Model<Document>,
  userId: string,
  recordIds: string[]
): Promise<DeleteResult> => {
  const deletedRecords = await db.deleteManyRecords(model, userId, recordIds)
  return deletedRecords
}

export default {
  create,
  getAll,
  getOne,
  updateOne,
  deleteOne,
  deleteManyRecords
}
