import { Router } from 'express'
import { type Schema, type Document } from 'mongoose' // Import Mongoose types or replace with your actual import

import models from '../schema'
import controller from './apiController'

const router = Router()
/* eslint-disable */
// Create dynamic routes for each Mongoose model
Object.keys(models).forEach(modelName => {
  const ModelSchema = models[modelName] as Schema<Document>
  console.log('_____❤️  auto crud endpoint:', `${modelName}s`)

  // Get all documents for this model
  router.get(`/${modelName}s`, controller.getAllRecords(modelName, ModelSchema))

  // Get a single document by ID
  router.get(`/${modelName}s/:id`, controller.getRecordById(modelName, ModelSchema))

  // Create a new document
  router.post(`/${modelName}s`, controller.createRecord(modelName, ModelSchema))

  // Update an existing document by ID
  router.put(`/${modelName}s/:id`, controller.updateRecordById(modelName, ModelSchema))

  // Delete many document by ID
  router.delete(`/${modelName}s`, controller.deleteManyRecords(modelName, ModelSchema))

  // Delete a document by ID
  router.delete(`/${modelName}s/:id`, controller.deleteRecordById(modelName, ModelSchema))
})

export default router
