const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/', function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

public_users.get('/author/:author', function (req, res) {
  const author = req.params.author.toLowerCase();
  const keys = Object.keys(books);
  let matchingBooks = [];

  keys.forEach((key) => {
    if (books[key].author.toLowerCase() === author) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

public_users.get('/title/:title', function (req, res) {
  const title = req.params.title.toLowerCase();
  const keys = Object.keys(books);
  let matchingBooks = [];

  keys.forEach((key) => {
    if (books[key].title.toLowerCase() === title) {
      matchingBooks.push(books[key]);
    }
  });

  if (matchingBooks.length > 0) {
    return res.status(200).send(JSON.stringify(matchingBooks, null, 4));
  } else {
    return res.status(404).json({ message: "No books found for this title" });
  }
});

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    return res.status(200).send(JSON.stringify(book.reviews, null, 4));
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

const axios = require('axios');

// Task 10 – Get all books (async/await)
async function getAllBooks() {
  try {
    const response = await axios.get('http://localhost:5000/');
    console.log("All Books:", response.data);
  } catch (error) {
    console.error(error.message);
  }
}

// Task 11 – Get book by ISBN
async function getBookByISBN(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    console.log("Book by ISBN:", response.data);
  } catch (error) {
    console.error(error.message);
  }
}

// Task 12 – Get books by Author
async function getBooksByAuthor(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    console.log("Books by Author:", response.data);
  } catch (error) {
    console.error(error.message);
  }
}

// Task 13 – Get books by Title
async function getBooksByTitle(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    console.log("Books by Title:", response.data);
  } catch (error) {
    console.error(error.message);
  }
}

//getAllBooks();
getBookByISBN(1);
getBooksByAuthor("Unknown");
getBooksByTitle("Fairy tales");



module.exports.general = public_users;
