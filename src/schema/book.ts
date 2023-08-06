import mongoose, { Schema, type Document, type Model } from 'mongoose'
import { schemaDefault } from '../utils/defaultSettings'
import { enums } from '../data' // Assuming BookStatus is an enum or constants for allowed book status values.

interface Book extends Document {
  userId: Schema.Types.ObjectId
  name: string
  status: keyof enums.BookStatus
  author: Schema.Types.ObjectId
  genre?: Schema.Types.ObjectId | null
  likes: number
  id: string
}

const bookSchema = new Schema<Book>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    name: {
      type: String,
      required: [true, '{PATH} is required']
    },
    status: {
      type: String,
      // default: enums.BookStatus.ACTIVE,
      enum: Object.values(enums.BookStatus),
      message: `Invalid status. Allowed values are ${Object.values(enums.BookStatus).join(', ')}.`
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: [true, '{PATH} is required']
    },
    genre: {
      ref: 'Genre',
      type: Schema.Types.ObjectId,
      default: null
    },
    likes: {
      type: Number,
      default: 0
    }
  },
  { ...schemaDefault }
)

bookSchema.virtual('id').get(function (this: Book) {
  return this._id.toHexString()
})

// TODO: allowed api methods
// const api = {
//   get: {
//     allowed: true,
//     auth: true
//   },
//   put: {
//     allowed: true,
//     auth: true
//   },
//   post: {
//     allowed: true,
//     auth: true
//   },
//   delete: {
//     allowed: true,
//     auth: true
//   }
// }

const BookModel: Model<Book> = mongoose.model<Book>('book', bookSchema)

export default BookModel
