import { type Document, type Schema } from 'mongoose'
import { type AuthenticatedRequest } from '../utils/interfaces'
import apiService from './apiService'
import { type Response, type NextFunction } from 'express'
import { sendSuccessResponse } from '../utils/apiResponse'
import httpStatus from 'http-status'
import validations from '../validations'

type AsyncMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>

type FunctionI = (modelName: string, modelSchema: Schema<Document>) => AsyncMiddleware

const getAllRecords: FunctionI = (modelName, modelSchema) => {
  return async (req, res, next) => {
    try {
      const { userId } = req.user
      const model = req.schoolDb.model(modelName, modelSchema)
      const data = await apiService.getAll(model, userId, req.query)

      sendSuccessResponse(res, data, httpStatus.OK)
    } catch (error) {
      next(error)
    }
  }
}

const getRecordById: FunctionI = (modelName, modelSchema) => {
  return async (req, res, next) => {
    const { id } = req.params
    const { userId } = req.user
    try {
      const model = req.schoolDb.model(modelName, modelSchema)
      const data = await apiService.getOne(model, userId, id)
      sendSuccessResponse(res, data, httpStatus.OK)
    } catch (error) {
      next(error)
    }
  }
}

const createRecord: FunctionI = (modelName, modelSchema) => {
  return async (req, res, next) => {
    const { userId } = req.user
    try {
      const model = req.schoolDb.model(modelName, modelSchema)

      const value = await validations[modelName].create.validateAsync(req.body)
      const data = await apiService.create(model, userId, value)

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
    const { userId } = req.user
    try {
      const model = req.schoolDb.model(modelName, modelSchema)
      const data = await apiService.updateOne(model, userId, id, record)
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
    const { userId } = req.user
    try {
      const model = req.schoolDb.model(modelName, modelSchema)
      const data = await apiService.deleteOne(model, userId, id)
      sendSuccessResponse(res, data, httpStatus.OK, 'Record Deleted successfully')
    } catch (error) {
      next(error)
    }
  }
}

const deleteManyRecords: FunctionI = (modelName, modelSchema) => {
  return async (req, res, next) => {
    const { ids } = req.body
    const { userId } = req.user
    try {
      const model = req.schoolDb.model(modelName, modelSchema)
      const data = await apiService.deleteManyRecords(model, userId, ids)

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
