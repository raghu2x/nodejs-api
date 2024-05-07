import { Router } from 'express'

import models from '@/api/schema'
import controller from '@/api/controllers/crudController'

const router = Router()
/* eslint-disable */
// Create dynamic routes for each Mongoose model
Object.keys(models).forEach(modelName => {
  const modelGetter = models[modelName]
  console.log('_____❤️  auto crud endpoint:', `${modelName}s`)

  // Get all documents for this model
  router.get(`/${modelName}s`, controller.getAllRecords(modelGetter))

  // Get a single document by ID
  router.get(`/${modelName}s/:id`, controller.getRecordById(modelGetter))

  // Create a new document
  router.post(`/${modelName}s`, controller.createRecord(modelGetter))

  // Update an existing document by ID
  router.put(`/${modelName}s/:id`, controller.updateRecordById(modelGetter))

  // Delete many document by ID
  router.delete(`/${modelName}s`, controller.deleteManyRecords(modelGetter))

  // Delete a document by ID
  router.delete(`/${modelName}s/:id`, controller.deleteRecordById(modelGetter))
})

export default router
