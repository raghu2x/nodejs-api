import { type Model, type Document, type Schema } from 'mongoose'
import apiService from './apiService'
import { sendSuccessResponse } from '@/utils/apiResponse'
import httpStatus from 'http-status'
import validations from '@/api/validations'
import { type CustomRequestHandler, type AuthenticatedUser } from '@/types/common'

type FunctionI = (modelName: (instituteName: string) => Model<any>) => CustomRequestHandler

const getAllRecords: FunctionI = getModel => {
  return async (req, res, next) => {
    try {
      const { userId, institutionName }: AuthenticatedUser = req.user

      const model = getModel(institutionName)

      console.log(model)
      const data = await apiService.getAll(model, req.query)

      sendSuccessResponse(res, data, httpStatus.OK)
    } catch (error) {
      next(error)
    }
  }
}

const getRecordById: FunctionI = getModel => {
  return async (req, res, next) => {
    const { id } = req.params
    const { userId, institutionName }: AuthenticatedUser = req.user

    const model = getModel(institutionName)

    try {
      const data: Record<string, any> = await apiService.getOne(model, id)
      sendSuccessResponse(res, data, httpStatus.OK)
    } catch (error) {
      next(error)
    }
  }
}

const createRecord: FunctionI = getModel => {
  return async (req, res, next) => {
    const { userId, institutionName }: AuthenticatedUser = req.user

    try {
      const model = getModel(institutionName)

      // 1. check if validations are defined
      // if (validations[modelName]?.create !== undefined) {
      //   req.body = await validations[modelName].create.validateAsync(req.body)
      // }

      const data: Record<string, any> = await apiService.create(model, req.body)

      sendSuccessResponse(res, data, httpStatus.CREATED, 'New record created')
    } catch (error) {
      next(error)
    }
  }
}

const updateRecordById: FunctionI = getModel => {
  return async (req, res, next) => {
    const { id } = req.params
    const record = req.body
    const { userId, institutionName }: AuthenticatedUser = req.user

    const model = getModel(institutionName)

    try {
      const data = await apiService.updateOne(model, id, record)
      res.send({ success: true, message: 'Record updated successfully', data })

      sendSuccessResponse(res, data, httpStatus.OK, 'Record updated successfully')
    } catch (error) {
      next(error)
    }
  }
}

const deleteRecordById: FunctionI = getModel => {
  return async (req, res, next) => {
    const { id } = req.params
    const { userId, institutionName }: AuthenticatedUser = req.user

    const model = getModel(institutionName)

    try {
      const data = await apiService.deleteOne(model, id)
      sendSuccessResponse(res, data, httpStatus.OK, 'Record Deleted successfully')
    } catch (error) {
      next(error)
    }
  }
}

const deleteManyRecords: FunctionI = getModel => {
  return async (req, res, next) => {
    const ids: string[] = req.body.ids
    const { userId, institutionName }: AuthenticatedUser = req.user

    const model = getModel(institutionName)

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
