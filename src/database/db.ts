// db.ts

import mongoose from 'mongoose'

let connection: mongoose.Connection | null = null

export const connectToDatabase = async (uri: string): Promise<mongoose.Connection | null> => {
  try {
    if (connection === null) {
      connection = await mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      console.log('Connected to the database')
    }

    return connection
  } catch (error) {
    console.error('Error connecting to the database:', error)
    throw error
  }
}
