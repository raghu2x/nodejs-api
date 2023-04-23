const mongoose = require('mongoose')
const { DB_CONFIG } = require('../config')

mongoose.set('strictQuery', false)

exports.connect = () => {
  mongoose
    .connect(process.env.MONGO_URI, DB_CONFIG)
    .then(res => {
      console.log('______________database connected Successfully')
    })
    .catch(err => {
      console.log('__________________database connection failed', err)
      process.exit(1)
    })
}
