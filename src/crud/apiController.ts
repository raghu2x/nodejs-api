import { type Model, type Document, type Schema, type Connection } from 'mongoose'
import apiService from './apiService'
import { sendSuccessResponse } from '../utils/apiResponse'
import httpStatus from 'http-status'
import validations from '../validations'
import { useDB } from '../database/connection'
import { type CustomRequestHandler, type AuthenticatedUser } from '@/types/common'

type FunctionI = (modelName: string, modelSchema: Schema<Document>) => CustomRequestHandler

const createModel = (db: Connection, modelName: string, modelSchema): Model<Document> => {
  return db.model(modelName, modelSchema) as Model<Document>
}

const getAllRecords: FunctionI = (modelName, modelSchema) => {
  return async (req, res, next) => {
    try {
      const { userId, institutionName }: AuthenticatedUser = req.user

      const institutionDB = await useDB(institutionName)
      const model = createModel(institutionDB, modelName, modelSchema)

      console.log(institutionName)
      const data = await apiService.getAll(model, req.query)

      sendSuccessResponse(res, data, httpStatus.OK)
    } catch (error) {
      next(error)
    }
  }
}

const getRecordById: FunctionI = (modelName, modelSchema) => {
  return async (req, res, next) => {
    const { id } = req.params
    const { userId, institutionName }: AuthenticatedUser = req.user

    const institutionDB = await useDB(institutionName)
    const model = createModel(institutionDB, modelName, modelSchema)

    try {
      const data: Record<string, any> = await apiService.getOne(model, id)
      sendSuccessResponse(res, data, httpStatus.OK)
    } catch (error) {
      next(error)
    }
  }
}

const createRecord: FunctionI = (modelName, modelSchema) => {
  return async (req, res, next) => {
    const { userId, institutionName }: AuthenticatedUser = req.user

    try {
      const institutionDB = await useDB(institutionName)
      const model = createModel(institutionDB, modelName, modelSchema)

      // 1. check if validations are defined
      if (validations[modelName]?.create !== undefined) {
        req.body = await validations[modelName].create.validateAsync(req.body)
      }

      const data: Record<string, any> = await apiService.create(model, req.body)

      sendSuccessResponse(res, data, httpStatus.CREATED, 'New record created')
    } catch (error) {
      next(error)
    }
  }
}

const updateRecordById: FunctionI = (modelName, modelSchema) => {
  return async (req, res, next) => {
    const { id } = req.params
    const record = req.body
    const { userId, institutionName }: AuthenticatedUser = req.user

    const institutionDB = await useDB(institutionName)
    const model = createModel(institutionDB, modelName, modelSchema)

    try {
      const data = await apiService.updateOne(model, id, record)
      res.send({ success: true, message: 'Record updated successfully', data })

      sendSuccessResponse(res, data, httpStatus.OK, 'Record updated successfully')
    } catch (error) {
      next(error)
    }
  }
}

const deleteRecordById: FunctionI = (modelName, modelSchema) => {
  return async (req, res, next) => {
    const { id } = req.params
    const { userId, institutionName }: AuthenticatedUser = req.user

    const institutionDB = await useDB(institutionName)
    const model = createModel(institutionDB, modelName, modelSchema)

    try {
      const data = await apiService.deleteOne(model, id)
      sendSuccessResponse(res, data, httpStatus.OK, 'Record Deleted successfully')
    } catch (error) {
      next(error)
    }
  }
}

const deleteManyRecords: FunctionI = (modelName, modelSchema) => {
  return async (req, res, next) => {
    const ids: string[] = req.body.ids
    const { userId, institutionName }: AuthenticatedUser = req.user

    const institutionDB = await useDB(institutionName)
    const model = createModel(institutionDB, modelName, modelSchema)

    try {
      const data = await apiService.deleteManyRecords(model, ids)

      sendSuccessResponse(res, data, httpStatus.OK, `Deleted ${data.deletedCount} records`)
    } catch (error) {
      next(error)
    }
  }
}

export default {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecordById,
  deleteRecordById,
  deleteManyRecords
}
