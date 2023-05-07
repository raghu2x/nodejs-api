const router = require('express').Router()
const models = require('../schema')
const controller = require('./apiController')

// Create dynamic routes for each Mongoose model
Object.keys(models).forEach(modelName => {
  const Model = models[modelName]
  console.log('___________ api_endpoint:', modelName)
  // Get all documents for this model
  router.get(`/${modelName}`, controller.getAllRecords(Model))

  // Get a single document by ID
  router.get(`/${modelName}/:id`, controller.getRecordById(Model))

  // Create a new document
  router.post(`/${modelName}`, controller.createRecord(Model))

  // Update an existing document by ID
  router.put(`/${modelName}/:id`, controller.updateRecordById(Model))

  // Delete many document by ID
  router.delete(`/${modelName}`, controller.deleteManyRecords(Model))

  // Delete a document by ID
  router.delete(`/${modelName}/:id`, controller.deleteRecordById(Model))
})

module.exports = router
