import { bookSchema } from './book' // Assuming you've exported the BookModel as default from './book' file.
// import OTPModel from './otp';
// import UserModel from './user';
import { genreSchema } from './genreSchema' // Assuming you've exported the GenreModel as default from './genreSchema' file.

export default {
  books: bookSchema,
  genres: genreSchema
  //   otp: OTPModel,
  //   users: UserModel,
}
