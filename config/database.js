const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log(
        "______________database connected Successfully"
        // res.connections[0].collections.users
      );
    })
    .catch((err) => {
      console.log("__________________database connection failed");
      console.log(err);
      process.exit(1);
    });
};
