require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
const auth = require("./middleware/auth");
const testRoute = require("./routes/test");
const authRouter = require("./routes/authentication");
const booksRouter = require("./routes/books");
app.use(express.json());

// routes
app.use("/", testRoute);
app.use("/api/auth", authRouter);
app.use("/api/books", auth, booksRouter);

module.exports = app;
