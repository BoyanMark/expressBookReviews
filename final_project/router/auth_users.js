const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()
const session = require('express-session')

let users = [
	{
		username: 'user1',
		password: 'user1',
	},
	{
		username: 'user2',
		password: 'user2',
	},
	{
		username: 'user3',
		password: 'user3',
	},
	{
		username: 'ranoa',
		password: 'bakfiets',
	},
]

const isValid = username => {
	const userMatches = users.filter(user => user.username === username)
	return userMatches.length > 0
}

const authenticatedUser = (username, password) => {
	const matchingUsers = users.filter(
		user => user.username === username && user.password === password
	)
	return matchingUsers.length > 0
}

regd_users.use(
	session({secret: 'fingerpint'}, (resave = true), (saveUninitialized = true))
)

regd_users.post('/login', (req, res) => {
	const username = req.body.username
	const password = req.body.password

	if (!username || !password) {
		return res.status(404).json({message: 'Error logging in'})
	}

	if (authenticatedUser(username, password)) {
		let accessToken = jwt.sign(
			{
				data: password,
			},
			'access',
			{expiresIn: 60 * 60}
		)

		req.session.authorization = {
			accessToken,
			username,
		}
		return res.status(200).send('User successfully logged in')
	} else {
		return res
			.status(208)
			.json({message: 'Invalid Login. Check username and password'})
	}
})

regd_users.put('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn
	const review = req.body.review
	const username = req.session.authorization.username
	if (books[isbn]) {
		let book = books[isbn]
		book.reviews[username] = review
		return res.status(200).send('Review successfully posted')
	} else {
		return res.status(404).json({message: `ISBN ${isbn} not found`})
	}
})

regd_users.delete('/auth/review/:isbn', (req, res) => {
	const isbn = req.params.isbn
	const username = req.session.authorization.username
	if (books[isbn]) {
		let book = books[isbn]
		delete book.reviews[username]
		return res.status(200).send('Review successfully deleted')
	} else {
		return res.status(404).json({message: `ISBN ${isbn} not found`})
	}
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users