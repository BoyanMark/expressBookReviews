const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!doesExist(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    console.log(books)
    return res.send(JSON.stringify({books},null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
  return res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author=req.params.author;
  for(let i=1;i<=10;i++){
      if(books[i].author===author)
      return res.send(books[i])
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title=req.params.title;
  for(let i=1;i<=10;i++){
      if(books[i].title===title)
      return res.send(books[i])
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn=req.params.isbn;
 return res.send(books[isbn].reviews)
});

//Task10
function allBooksPromise() {
    return new Promise((resolve, reject) => {
    resolve(books);
    });
    }
    allBooksPromise();

//Task11
function getBooksISBN(isbn) {
    return new Promise((resolve, reject) => {
    let isbn = parseInt(isbn);
    if (books[isbn]) {
    resolve(books[isbn]);
    } else {
    reject({ status: 404, message: "This ISBN ${isbn} was not found" });
    }
    })
    }
    getBooksISBN(1)

//Task12
function getByAuthor(author) {
    return new Promise((resolve, reject) => {
    let authname = author;
    if (books[author]) {
    resolve(books[author]);
    }
    })
    }
    getByAuthor("Chinua Achebe")

//Task13
function getByTitle(title) {
    return new Promise((resolve, reject) => {
    if (books[title]) {
    resolve(books[title]);
    }})}
    getByTitle("Fairy tales")

module.exports.general = public_users;
