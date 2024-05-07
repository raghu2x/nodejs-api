import { type Connection, type Schema } from 'mongoose'
import { connectToMasterDB } from '@/database/connection'
import { type Request, type Response, type NextFunction } from 'express'
import instituteSchema from '@/api/schema/master/institute'
import httpStatus from 'http-status'
import { sendErrorResponse } from '@/utils/apiResponse'
import adminUserSchema from '@/api/schema/master/admin'

const TenantSchemas = new Map<string, Schema>([
  ['tenant', instituteSchema],
  ['admin', adminUserSchema]
])

interface CustomRequest extends Request {
  masterDb: Connection
  schoolDb?: Connection
}

const registerSchema = (db: Connection, dbSchema): Connection => {
  if (Object.keys(db.models).length === 0) {
    dbSchema.forEach((schema, modelName: string) => {
      db.model(modelName, schema)
    })
  }

  return db
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
const connectDB = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    // 1. Connect to the master database
    const masterDb: Connection = connectToMasterDB()

    // 2. Register masterDb schema and masterDb in req for use
    req.masterDb = registerSchema(masterDb, TenantSchemas)

    // 1. Check if this is a request for creating a new tenant
    const isCreatingTenant = req.path === '/api/create-tenant' // Adjust the path as needed

    if (isCreatingTenant) {
      // If creating a tenant, bypass the middleware and proceed to the next middleware
      next()
      return
    }

    next()
  } catch (err) {
    const statusCode: number = err?.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR

    sendErrorResponse(res, statusCode, err?.message as string)
  }
}

export default connectDB
