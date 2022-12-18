require("dotenv").config();
require("./database/database").connect();
const router = require("./router");
const express = require("express");
const app = express();

app.use(express.json());
app.use("/", router);

module.exports = app;
