const express = require("express");
const router = express.Router();
const fs = require("fs");
const fsPromises = require("fs").promises;
const auth = require("../middleware/auth");
let id = 4;

let books = fs.readFile(`${__dirname}/books.json`, (err, data) => {
  books = JSON.parse(data);
});

router.get("/", auth, (req, res) => {
  res.send(books);
});

router.get("/:id", (req, res) => {
  let book = books.find((book) => book.id == req.params.id);
  if (!book) {
    res.status(404).send({ error: `book not found with id ${req.params.id}` });
  }
  res.send(book);
});

router.put("/:id", (req, res) => {
  let book = books.find((book) => book.id == req.params.id);
  if (!book) {
    res.status(404).send({ error: `book not found with id ${req.params.id}` });
  }
  book.title = req.body.title;
  res.send({ message: "updated Successfully", book });
});

router.delete("/:id", (req, res) => {
  let book = books.find((book) => book.id == req.params.id);
  if (!book) {
    res.status(404).send({
      success: false,
      message: `book not found with id ${req.params.id}`,
    });
  }
  res.send({ success: true, message: "Deleted Successfully", book });
});

router.post("/", (req, res) => {
  if (!req.body.title) {
    res.status(400).send({
      success: false,
      message: "invalid book title",
    });
  }
  fsPromises
    .readFile("books.json", "utf8")
    .then((data) => {
      let json = JSON.parse(data);
      json.push({ title: req.body.title, id: ++id });

      fsPromises
        .writeFile("books.json", JSON.stringify(json))
        .then(() => {
          console.log("Append Success");

          res.send({
            success: true,
            message: "added new book",
            book: { id: id++, title: req.body.title },
          });
        })
        .catch((err) => {
          console.log("Append Failed: " + err);
        });
    })
    .catch((err) => {
      console.log("Read Error: " + err);
    });
});

module.exports = router;
