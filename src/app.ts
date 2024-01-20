import express from 'express'

import router from '@/api/router'
import handleErrors from './api/middlewares/handleErrors'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import connectDB from './api/middlewares/connectDB'

const app: express.Express = express()

// app.use('/uploads', express.static(path.join(__dirname, '../.temp/uploads')))

app.use(express.static('src/public'))

app.use(cookieParser())

// Body parser, reading data from body into req.body
app.use(
  express.json({
    limit: '10kb'
  })
)

// Allow Cross-Origin requests
app.use(cors())

// Set security HTTP headers
app.use(helmet())

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.use(connectDB)

app.use('/', router)

app.use(handleErrors)

export default app
