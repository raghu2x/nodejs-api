const router = require('express').Router()
const auth = require('../middleware/auth')
const routes = require('./routes')
const authRouter = require('./authRouter')
const crudRouter = require('../crud/apiRouter')

router.use('/api/auth', authRouter)
router.use('/api', auth, crudRouter)
router.use('/', routes)

router.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: "Requested endpoint doesn't exist or method not allowed!",
  })
})

module.exports = router