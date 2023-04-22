const apiService = require('./apiService')

const getAllRecords = model => async (req, res) => {
  try {
    const data = await apiService.getAll(model, req.query)
    res.send({ success: true, data })
  } catch (error) {
    res.status(error.status || 400).send({
      success: false,
      message: error.message || error,
    })
  }
}

const getRecordById = model => async (req, res) => {
  const { id } = req.params
  try {
    const data = await apiService.getOne(model, id)
    res.status(200).send({
      success: true,
      data,
    })
  } catch (error) {
    res.status(error.statusCode || 400).send({
      success: false,
      message: error.message || error,
    })
  }
}

const createRecord = model => async (req, res) => {
  try {
    const data = await apiService.create(model, req.body)
    res.status(201).send({
      success: true,
      message: 'New record created',
      data,
    })
  } catch (error) {
    res.status(error.statusCode || 400).send({
      success: false,
      message: error.message || error,
      errors: error.errors,
    })
  }
}

const updateRecordById = model => async (req, res) => {
  const { id } = req.params
  const book = req.body
  try {
    const data = await apiService.updateOne(model, id, book)
    res.send({ success: true, message: 'Record updated successfully', data })
  } catch (error) {
    res.status(error.statusCode || 400).send({
      success: false,
      message: error.message || error,
    })
  }
}

const deleteRecordById = model => async (req, res) => {
  const { id } = req.params
  try {
    const data = await apiService.deleteOne(model, id)
    res.send({ success: true, message: 'Record Deleted Successfully', data })
  } catch (error) {
    res.status(error.statusCode || 400).send({
      success: false,
      message: error.message || error,
    })
  }
}
const deleteManyRecords = model => async (req, res) => {
  const { ids } = req.body
  try {
    const data = await apiService.deleteManyRecords(model, ids)
    res.send({ success: true, message: `Deleted ${data.deletedCount} records` })
  } catch (error) {
    res.status(error.statusCode || 400).send({
      success: false,
      message: error.message || error,
    })
  }
}

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecordById,
  deleteRecordById,
  deleteManyRecords,
}
