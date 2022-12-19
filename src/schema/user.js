const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      default: "",
      trim: true,
      required: [true, "{PATH} is required"],
      minLength: 3,
    },
    lastName: {
      type: String,
      default: "",
      trim: true,
      required: [true, "{PATH} is required"],
      minLength: [3, "min 3 character required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "{PATH} is required"],
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v),
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: [true, "{PATH} is required"],
      validate: {
        validator: (v) =>
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/.test(
            v
          ),
        message:
          "Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter and one number",
      },
    },
    token: { type: String },
  },
  { versionKey: false }
);

module.exports = mongoose.model("user", userSchema);
