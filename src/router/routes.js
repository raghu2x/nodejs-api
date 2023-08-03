const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'hey welcome to our app'
  })
})

router.get('/env', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'hey welcome to our app',
    env: process.env
  })
})

router.get('/api/endpoints', (req, res) => {
  // @ts-ignore
  console.log(req.user, '___________user')
  res.send({
    success: true
    // data: Object.keys(models),
  })
})

module.exports = router
