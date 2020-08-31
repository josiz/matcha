const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const {tokenSecret} = require('../config.json');
const pool = require('./dbConnect');

const authenticationMiddleware = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) {
		req.user = null;
		next();
	}
	else {
		jwt.verify(token, tokenSecret, (err, user) => {
			if (err) {
				req.user = null;
				next();
			}
			else {
				pool.query(mysql.format('SELECT `online` FROM users WHERE id = ? AND login_id = ?;', [user.id, user.login_id]), (error, results) => {
					if (error || !results[0] || !results[0].online)
						return res.json('logged out');
					else {
						req.user = user;
						next();
					}
				})
			}
		});
	}
}

const generateJWT = data => jwt.sign(data, tokenSecret);

module.exports = {
	authenticationMiddleware,
	generateJWT
}
