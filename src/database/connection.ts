import { env } from '@/utils/env'
import mongoose, { type Model, type Connection, type Document, type ConnectOptions } from 'mongoose'
// import { DB_CONFIG } from '../config'

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

export const createConnection = async (dbName: string): Promise<Connection> => {
  try {
    const uri = `${process.env.MONGO_URI}/${dbName}`
    const existingConnection = connections.find(conn => conn.uri === uri)

    if (existingConnection?.connection !== undefined) {
      return existingConnection.connection
    }

    const newConnection = mongoose.createConnection(env('MONGO_URI'), clientOption)

    connections.push({ uri, connection: newConnection })
    console.log(`Connected to the database: ${uri}`)

    return newConnection
  } catch (error) {
    console.error(`Error connecting to the database: ${dbName}`, error)
    throw error
  }
}
export const connectToDatabase = async (dbName: string): Promise<Connection> => {
  try {
    const uri = `${process.env.MONGO_URI}/${dbName}`
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
export const connectToMasterDB = async (): Promise<Connection> => {
  return await connectToDatabase('master_database')
}

export const useDB = async (dbName: string): Promise<Connection> => {
  const mongoConnection = connectToDatabase(dbName)
  return await mongoConnection
}

export const getDBModel = (db: Connection, modelName: string): Model<Document> => {
  const model = db.model(modelName)
  if (model !== null) return model as Model<Document>
  throw new Error('Model not found')
}

export const createModel = (db: Connection, modelName: string, modelSchema): Model<Document> => {
  return db.model(modelName, modelSchema) as Model<Document>
}
