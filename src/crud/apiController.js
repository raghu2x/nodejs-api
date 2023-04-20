const apiService = require('./apiService')

const getAll = model => async (req, res) => {
  try {
    const data = await apiService.getAll(model, req.query)
    res.send({ success: true, data })
  } catch (error) {
    console.log(error)
    res.status(error.status || 400).send({
      success: false,
      message: error.message || error,
    })
  }
}

const getById = model => async (req, res) => {
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

const create = model => async (req, res) => {
  try {
    const data = await apiService.create(model, req.body)
    res.status(201).send({
      success: true,
      message: 'added new book',
      data,
    })
  } catch (error) {
    console.log('___________', error)
    res.status(error.statusCode || 400).send({
      success: false,
      message: error.message || error,
    })
  }
}

const updateById = model => async (req, res) => {
  const { id } = req.params
  const book = req.body
  try {
    const data = await apiService.updateOne(model, id, book)
    res.send({ success: true, message: 'updated Successfully', data })
  } catch (error) {
    res.status(error.statusCode || 400).send({
      success: false,
      message: error.message || error,
    })
  }
}

const deleteById = model => async (req, res) => {
  const { id } = req.params
  try {
    const data = await apiService.deleteOne(model, id)
    res.send({ success: true, message: 'Deleted Successfully', data })
  } catch (error) {
    res.status(error.statusCode || 400).send({
      success: false,
      message: error.message || error,
    })
  }
}

const deleteMany = model => async (req, res) => {
  const { ids } = req.body
  res.send({ success: true, message: `deleted ${ids.join(',')}` })
  //   const data = await model.deleteMany({ _id: { $in: ids } })
  //   res.json(data)
}

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  deleteMany,
}
