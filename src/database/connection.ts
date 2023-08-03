import mongoose, { type ConnectOptions } from 'mongoose'
import { DB_CONFIG } from '../config'

mongoose.set('strictQuery', false)

export const connect = (): void => {
  const { MONGO_URI } = process.env
  mongoose
    .connect(MONGO_URI ?? '', DB_CONFIG as ConnectOptions)
    .then(() => {
      console.log('______________database connected Successfully')
    })
    .catch((err: Error) => {
      console.log('__________________database connection failed', err)
      process.exit(1)
    })
}
