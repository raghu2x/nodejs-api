import { type Model, type Document } from 'mongoose'
import { type AuthenticatedRequest } from '../utils/interfaces'
import apiService from './apiService'
import { type Response, type NextFunction } from 'express'
import { sendSuccessResponse } from '../utils/apiResponse'
import httpStatus from 'http-status'

type AsyncMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => Promise<void>

const getAllRecords = (model: Model<Document>): AsyncMiddleware => {
  return async (req, res, next) => {
    try {
      const { userId } = req.user
      const data = await apiService.getAll(model, userId, req.query)

      sendSuccessResponse(res, data, httpStatus.OK)
    } catch (error) {
      next(error)
    }
  }
}

const getRecordById = (model: Model<Document>): AsyncMiddleware => {
  return async (req, res, next) => {
    const { id } = req.params
    const { userId } = req.user
    try {
      const data = await apiService.getOne(model, userId, id)
      sendSuccessResponse(res, data, httpStatus.OK)
    } catch (error) {
      next(error)
    }
  }
}

const createRecord = (model: Model<Document>): AsyncMiddleware => {
  return async (req, res, next) => {
    const { userId } = req.user
    try {
      const data = await apiService.create(model, userId, req.body)

      sendSuccessResponse(res, data, httpStatus.CREATED, 'New record created')
    } catch (error) {
      next(error)
    }
  }
}

const updateRecordById = (model: Model<Document>): AsyncMiddleware => {
  return async (req, res, next) => {
    const { id } = req.params
    const record = req.body
    const { userId } = req.user
    try {
      const data = await apiService.updateOne(model, userId, id, record)
      res.send({ success: true, message: 'Record updated successfully', data })

      sendSuccessResponse(res, data, httpStatus.OK, 'Record updated successfully')
    } catch (error) {
      next(error)
    }
  }
}

const deleteRecordById = (model: Model<Document>): AsyncMiddleware => {
  return async (req, res, next) => {
    const { id } = req.params
    const { userId } = req.user
    try {
      const data = await apiService.deleteOne(model, userId, id)
      sendSuccessResponse(res, data, httpStatus.OK, 'Record Deleted successfully')
    } catch (error) {
      next(error)
    }
  }
}

const deleteManyRecords = (model: Model<Document>): AsyncMiddleware => {
  return async (req, res, next) => {
    const { ids } = req.body
    const { userId } = req.user
    try {
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
