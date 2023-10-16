import express from 'express'
import 'dotenv/config'
import { connect } from './database/connection'
import router from './router'
import handleErrors from './middleware/handleErrors'
import helmet from 'helmet'
import cors from 'cors'

connect() // connect mongoDB

const app: express.Express = express()

app.use(express.static('public'))
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use('/', router)
app.use(handleErrors)

export default app
