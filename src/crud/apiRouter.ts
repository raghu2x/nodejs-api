import { Router } from 'express'
import { type Document, type Model } from 'mongoose' // Import Mongoose types or replace with your actual import

import models from '../schema'
import controller from './apiController'

const router = Router()
/* eslint-disable */
// Create dynamic routes for each Mongoose model
Object.keys(models).forEach(modelName => {
  const Model = models[modelName] as Model<Document>
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

export default router
