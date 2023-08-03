// app.ts
import express from 'express'
import { config } from 'dotenv'
import { connect } from './database/connection'
import router from './router'
import handleErrors from './middleware/handleErrors'

config() // Equivalent to require('dotenv').config()
connect()
const app: express.Express = express() // Explicitly specify the type for 'app'

app.use(express.json())
app.use('/', router)
app.use(handleErrors)

export default app // Export the 'app' object
