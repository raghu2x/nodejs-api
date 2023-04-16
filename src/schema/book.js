const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bookSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "{PATH} is required"],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "{PATH} is required"],
    },
    genre: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: {
      createdAt: "publishedOn",
      updatedAt: "updatedAt",
    },
    toJSON: { virtuals: true }
  }
);


module.exports = mongoose.model("book", bookSchema);
