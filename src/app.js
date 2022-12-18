require("dotenv").config();
require("./database/connection").connect();
const router = require("./router");
const express = require("express");
const app = express();

app.use(express.json());
app.use("/", router);

module.exports = app;
