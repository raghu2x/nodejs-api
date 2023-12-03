import mongoose, { type Model, type Connection, type Document } from 'mongoose'
// import { DB_CONFIG } from '../config'

mongoose.set('strictQuery', false)

interface ConnectionInfo {
  uri: string
  connection: Connection
}

const connections: ConnectionInfo[] = []

export const connectToDatabase = async (dbName: string): Promise<Connection> => {
  try {
    const uri = `${process.env.MONGO_URI}/${dbName}`
    const existingConnection = connections.find(conn => conn.uri === uri)

    if (existingConnection?.connection !== undefined) {
      return existingConnection.connection
    }

    const newConnection = mongoose.createConnection(uri, {})

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

export const getDBModel = (db: Connection, modelName: string): Model<Document> => {
  const model = db.model(modelName)
  if (model !== null) return model as Model<Document>
  throw new Error('Model not found')
}
