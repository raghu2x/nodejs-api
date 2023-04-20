const mongoose = require('mongoose')
const Books = require('../schema/book') // users schema

const Task = mongoose.model('Task', {
  title: {
    type: String,
    required: [true, '{PATH} is required'],
  },
  description: String,
})

module.exports = {
  Task,
  Books,
}
