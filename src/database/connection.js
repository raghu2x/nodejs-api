const mongoose = require('mongoose')

const { MONGO_URI } = process.env

const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}

exports.connect = () => {
  mongoose
    .connect(MONGO_URI, config)
    .then(res => {
      console.log('______________database connected Successfully')
    })
    .catch(err => {
      console.log('__________________database connection failed', err)
      process.exit(1)
    })
}
