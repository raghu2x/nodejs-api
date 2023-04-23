require('dotenv').config()
require('./database/connection').connect()
const router = require('./router')
const express = require('express')
const app = express()
const handleErrors = require('./middleware/handleErrors')

app.use(express.json())
app.use('/', router)
app.use(handleErrors)

module.exports = app
