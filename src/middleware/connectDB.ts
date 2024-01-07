import { type Connection, type Schema } from 'mongoose'
import { connectToDatabase, connectToMasterDB } from '../database/connection'
import { type Request, type Response, type NextFunction } from 'express'
import studentSchema from '../schema/institute/student'
import instituteSchema from '../schema/master/institute'
import { userSchema } from '../schema/institute/user'
import httpStatus from 'http-status'
import { sendErrorResponse } from '../utils/apiResponse'
import AppError from '../utils/appError'
import adminUserSchema from '../schema/master/admin'

const InstituteSchemas = new Map<string, Schema>([
  ['student', studentSchema],
  ['user', userSchema]
])

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
    const masterDb: Connection = await connectToMasterDB()

    // 2. Register masterDb schema and masterDb in req for use
    req.masterDb = registerSchema(masterDb, TenantSchemas)

    // 1. Check if this is a request for creating a new tenant
    const isCreatingTenant = req.path === '/api/create-tenant' // Adjust the path as needed

    if (isCreatingTenant) {
      // If creating a tenant, bypass the middleware and proceed to the next middleware
      next()
      return
    }

    // 3 extract schoolId from params
    // const schoolId: string | undefined = req.headers['x-school-id'] as string

    // if (schoolId === '' || schoolId === undefined) {
    //   throw new AppError(httpStatus.NOT_FOUND, 'schoolId is required.')
    // }

    // Check if the schoolId exists in the master database
    // const tenantsCollection = masterDb.collection('tenants')
    // const tenantExists = await tenantsCollection.findOne({ schoolId })

    // if (tenantExists === null) {
    //   throw new AppError(httpStatus.NOT_FOUND, `School '${schoolId}' does not exist.`)
    // }

    // 4. Connect to the school-specific database
    // const schoolDb = await connectToDatabase(schoolId)

    // 5. Register masterDb schema and masterDb in req for use
    // req.schoolDb = registerSchema(schoolDb, InstituteSchemas)

    next()
  } catch (err) {
    const statusCode: number = err?.statusCode ?? httpStatus.INTERNAL_SERVER_ERROR

    sendErrorResponse(res, statusCode, err?.message as string)
  }
}

export default connectDB
