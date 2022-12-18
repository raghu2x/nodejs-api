const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "{PATH} is required"],
    },
  },
  { versionKey: false }
);

module.exports = mongoose.model("book", bookSchema);
