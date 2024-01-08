import { type Model, type Document } from 'mongoose'

export const create = async (model: Model<Document>, record: any): Promise<any> => {
  const createdRecord = await model.create({ ...record })
  return createdRecord
}

// export default async (model: Model<Document>, req, res, next): Promise<any> => {
//   const { userId, institutionName }: AuthenticatedUser = req.user

//   try {
//     const institutionDB = await useDB(institutionName)
//     const model = createModel(institutionDB, modelName, modelSchema)

//     // 1. check if validations are defined
//     if (validations[modelName]?.create !== undefined) {
//       req.body = await validations[modelName].create.validateAsync(req.body)
//     }

//     const data: Record<string, any> = await model.create({ ...req.body })

//     sendSuccessResponse(res, data, httpStatus.CREATED, 'New record created')
//   } catch (error) {
//     next(error)
//   }
// }
