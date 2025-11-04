const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// check if username exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// check if username and password match
const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// user registration
regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// login route
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      { data: username },
      "access",
      { expiresIn: "1h" }
    );
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "Login successful", token: accessToken });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add/modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) return res.status(403).json({ message: "User not logged in" });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!review) return res.status(400).json({ message: "Review text required" });

  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated", reviews: books[isbn].reviews });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) return res.status(403).json({ message: "User not logged in" });
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });

  if (books[isbn].reviews[username]) {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted", reviews: books[isbn].reviews });
  } else {
    return res.status(404).json({ message: "No review found for this user" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
