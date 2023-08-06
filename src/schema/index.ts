import BookModel from './book' // Assuming you've exported the BookModel as default from './book' file.
// import OTPModel from './otp';
// import UserModel from './user';
import GenreModel from './genreSchema' // Assuming you've exported the GenreModel as default from './genreSchema' file.

export default {
  books: BookModel,
  genres: GenreModel
  //   otp: OTPModel,
  //   users: UserModel,
}
