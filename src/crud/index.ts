import { create } from './create'
import { updateOne } from './update'
import { deleteManyRecords, deleteOne } from './remove'
import { getAll, getOne } from './getRecords'

const createCrudController = (Model): Record<string, any> => {
  const crudMethods = {
    // create: async (req, res, next) => await create(Model, req, res, next),
    // update: async (req, res, next) => await updateOne(Model, req, res, next),
    // delete: async (req, res, next) => await deleteOne(Model, req, res, next),
    // list: async (req, res, next) => await getAll(Model, req, res, next)
  }

  return crudMethods
}

export default createCrudController
