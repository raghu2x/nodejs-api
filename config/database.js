const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

exports.connect = () => {
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true,
      // useFindAndModify: true,
      // strictQuery: false,
    })
    .then(() => console.log("______________database connected Successfully"))
    .catch((err) => {
      console.log("__________________database connection failed");
      console.log(err);
      process.exit(1);
    });
};
