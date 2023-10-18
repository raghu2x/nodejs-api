import express from 'express'
import 'dotenv/config'
import './database/connection'
import router from './router'
import handleErrors from './middleware/handleErrors'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app: express.Express = express()

app.use(express.static('public'))

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

app.use('/', router)

app.use(handleErrors)

export default app
