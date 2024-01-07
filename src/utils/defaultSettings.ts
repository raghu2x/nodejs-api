import { type SchemaOptions } from 'mongoose'

export const schemaDefault: SchemaOptions = {
  // _id: false,
  // id: true,
  // autoCreate: true,
  versionKey: false,
  timestamps: true,
  // strictPopulate: false,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id
    }
  }
}
