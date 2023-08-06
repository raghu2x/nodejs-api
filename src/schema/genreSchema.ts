import mongoose, { Schema, type Document, type Model, type Types } from 'mongoose'
import { schemaDefault } from '../utils/defaultSettings'

interface Genre extends Document {
  userId: Types.ObjectId
  name: string
  description?: string | null
  id: string
}

const genreSchema = new Schema<Genre>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
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

genreSchema.virtual('id').get(function (this: Genre) {
  return this._id.toHexString()
})

const GenreModel: Model<Genre> = mongoose.model<Genre>('Genre', genreSchema)

export default GenreModel
