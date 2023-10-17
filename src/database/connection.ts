import mongoose from 'mongoose'
import { DB_CONFIG } from '../config'

mongoose.set('strictQuery', false)

mongoose
  .connect(process.env.MONGO_URI ?? '', DB_CONFIG)
  .then(() => {
    console.log('______________database connected Successfully')
  })
  .catch((err: Error) => {
    console.log('__________________database connection failed', err)
    process.exit(1)
  })
