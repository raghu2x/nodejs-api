const router = require('express').Router()
const auth = require('../middleware/auth')
const testRoute = require('./test')
const authRouter = require('./authentication')
const crudRouter = require('../crud/apiRouter')

router.use('/api/auth', authRouter)
router.use('/api', crudRouter)
router.use('/', testRoute)

module.exports = router