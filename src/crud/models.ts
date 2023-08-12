import mongoose, { Schema, type Document } from 'mongoose'
import { schemaDefault } from '../utils/defaultSettings'
import Book from '../schema/book' // Import the correct schema and type for books

interface IGenre extends Document {
  name: string
  description: string | null
}

const GenreSchema = new Schema<IGenre>(
  {
    name: {
      type: String,
      required: [true, '{PATH} is required']
    },
    description: {
      type: String,
      default: null
    }
  },
  { ...schemaDefault }
)

GenreSchema.virtual('id').get(function (this: IGenre) {
  return this._id.toHexString()
})

const GenreModel = mongoose.model<IGenre>('Genre', GenreSchema)

export default { Book, GenreModel }
