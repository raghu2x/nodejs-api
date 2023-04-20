const router = require('express').Router()
const models = require('./models')
const controller = require('./apiController')

// Create dynamic routes for each Mongoose model
Object.keys(models).forEach(modelName => {
  const Model = models[modelName]
  console.log('___________ modelName', modelName)
  // Get all documents for this model
  router.get(`/${modelName}`, controller.getAll(Model))

  // Get a single document by ID
  router.get(`/${modelName}/:id`, controller.getById(Model))

  // Create a new document
  router.post(`/${modelName}`, controller.create(Model))

  // Update an existing document by ID
  router.put(`/${modelName}/:id`, controller.updateById(Model))

  // Delete many document by ID
  router.delete(`/${modelName}`, controller.deleteMany(Model))

  // Delete a document by ID
  router.delete(`/${modelName}/:id`, controller.deleteById(Model))
})

module.exports = router
