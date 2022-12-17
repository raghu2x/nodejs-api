require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const app = express();
const testRoute = require("./routes/test");
const loginRouter = require("./routes/authentication/login");
const registerRouter = require("./routes/authentication/register");
const booksRouter = require("./routes/books");
app.use(express.json());

// routes
app.use("/api", testRoute);
app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/books", booksRouter);

module.exports = app;
