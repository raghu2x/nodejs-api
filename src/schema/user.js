const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
      required: [true, "{PATH} is required"],
    },
    lastName: {
      type: String,
      default: "",
      required: [true, "{PATH} is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "{PATH} is required"],
    },
    password: { type: String, required: [true, "{PATH} is required"] },
    token: { type: String },
  },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
