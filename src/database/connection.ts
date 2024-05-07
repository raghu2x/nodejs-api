import { env, envOrFail } from '@/utils/env'
import mongoose, { type Model, type Connection, type Document, type ConnectOptions } from 'mongoose'

// mongoose.set('strictQuery', false)

const clientOption: ConnectOptions = {
  socketTimeoutMS: 30000
  // family: 4
}

interface ConnectionInfo {
  uri: string
  connection: Connection
}

const connections: ConnectionInfo[] = []

export const connectToDatabase = (dbName: string): Connection => {
  try {
    const uri = `${envOrFail('MONGO_URI')}/${dbName}`
    const existingConnection = connections.find(conn => conn.uri === uri)

    if (existingConnection?.connection !== undefined) {
      return existingConnection.connection
    }

    const newConnection = mongoose.createConnection(uri, clientOption)

    connections.push({ uri, connection: newConnection })
    console.log(`Connected to the database: ${uri}`)

    return newConnection
  } catch (error) {
    console.error(`Error connecting to the database: ${dbName}`, error)
    throw error
  }
}

// Additional function to connect to the school database
export const connectToMasterDB = (): Connection => {
  return connectToDatabase('master_database')
}

export const useDB = (dbName: string): Connection => {
  const mongoConnection = connectToDatabase(dbName)
  return mongoConnection
}

export const createModel = (db: Connection, modelName: string, modelSchema): Model<Document> => {
  return db.model(modelName, modelSchema) as Model<Document>
}

export const getModelByTenant = <T = any>(
  tenantId: string,
  modelName: string,
  modelSchema
): Model<T> => {
  const conn = connectToDatabase(tenantId)
  return conn.model(modelName, modelSchema) as Model<T>
}
