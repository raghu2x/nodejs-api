const express = require("express");
const fs = require("fs");
const fsPromises = require("fs").promises;
const app = express();
const auth = require("./middleware/auth");
let id = 4;
app.use(express.json());

let books = fs.readFile(`${__dirname}/books.json`, (err, data) => {
  books = JSON.parse(data);
});

app.get("/", auth, (req, res) => {
  res.statusCode = 200;
  res.send("welcome to node.js api's");
});

// basic demo api
app.get("/api/books", auth, (req, res) => {
  res.send(books);
});

app.get("/api/books/:id", (req, res) => {
  let book = books.find((book) => book.id == req.params.id);
  if (!book) {
    res.status(404).send({ error: `book not found with id ${req.params.id}` });
  }
  res.send(book);
});

app.put("/api/books/:id", (req, res) => {
  let book = books.find((book) => book.id == req.params.id);
  if (!book) {
    res.status(404).send({ error: `book not found with id ${req.params.id}` });
  }
  book.title = req.body.title;
  res.send({ message: "updated Successfully", book });
});

app.delete("/api/books/:id", (req, res) => {
  let book = books.find((book) => book.id == req.params.id);
  if (!book) {
    res.status(404).send({
      success: false,
      message: `book not found with id ${req.params.id}`,
    });
  }
  res.send({ success: true, message: "Deleted Successfully", book });
});

app.post("/api/books", (req, res) => {
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
app.listen(3000);
