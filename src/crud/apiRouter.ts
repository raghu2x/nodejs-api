import { Router } from 'express'
import { type Schema, type Document } from 'mongoose' // Import Mongoose types or replace with your actual import

import models from '../schema'
import controller from './apiController'

const router = Router()
/* eslint-disable */
// Create dynamic routes for each Mongoose model
Object.keys(models).forEach(modelName => {
  const ModelSchema = models[modelName] as Schema<Document>
  console.log('___________ api_endpoint:', modelName)

  // Get all documents for this model
  router.get(`/${modelName}`, controller.getAllRecords(modelName, ModelSchema))

  // Get a single document by ID
  router.get(`/${modelName}/:id`, controller.getRecordById(modelName, ModelSchema))

  // Create a new document
  router.post(`/${modelName}`, controller.createRecord(modelName, ModelSchema))

  // Update an existing document by ID
  router.put(`/${modelName}/:id`, controller.updateRecordById(modelName, ModelSchema))

  // Delete many document by ID
  router.delete(`/${modelName}`, controller.deleteManyRecords(modelName, ModelSchema))

  // Delete a document by ID
  router.delete(`/${modelName}/:id`, controller.deleteRecordById(modelName, ModelSchema))
})

export default router
