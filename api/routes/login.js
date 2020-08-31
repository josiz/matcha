const mysql = require('mysql');
const pool = require('../modules/dbConnect');
const hashPassword = require('../modules/hash');
const mysqlDatetime = require('../modules/mysqlDatetime');
const {getLoginCoordinates} = require('../modules/getLoginCoordinates');
const {generateJWT} = require('../modules/authentication');

const loginFunction = (req, res, preparedQuery) => {
	pool.query(preparedQuery, (error, results) => {
		// Some kind of DB error
		if (error) {
			return res.json('Database error');
		}
		// Login successful
		else if (results && results[0] && !results[0].email_confirmation_string && !results[0].forgot_password_string) {
			// Get login coordinates either from req.body or user's IP
			const loginCoordinates = getLoginCoordinates(req, results[0]);

			const tags = results[0].tags_string ? results[0].tags_string.split(',') : null;
			const userData = {
				id: results[0].id,
				username: results[0].username,
				lat: loginCoordinates.latitude,
				lon: loginCoordinates.longitude,
				age: results[0].age || 25,
				tags: tags,
				token: generateJWT({
					user: results[0].username,
					id: results[0].id,
					lat: loginCoordinates.latitude,
					lon: loginCoordinates.longitude,
					tags: tags,
					login_id: results[0].login_id
				})
			};
			pool.query(`UPDATE users
				SET last_login = '${mysqlDatetime(new Date())}',
					latitude = ${loginCoordinates.latitude},
					longitude = ${loginCoordinates.longitude},
					\`online\` = \`online\` + 1
				WHERE id = ${results[0].id};`);
			return res.json(userData);
		}
		// Email address is not confirmed
		else if (results[0]) {
			return res.json('email');
		}
		// Password or username incorrect
		else
			return res.json(null);
	});
};

const post = (req, res, next) => {
	// User is already logged in
	if (req.user)
		return res.json(null);
	
	// Username or password not provided
	if (!req.body.username || !req.body.password)
		return res.json(null);

	const hashedPassword = hashPassword(req.body.username, req.body.password);
	const query = 'SELECT * FROM user_and_main_photo WHERE username = ? AND password = ?;';
	const preparedQuery = mysql.format(query, [req.body.username, hashedPassword]);

	loginFunction(req, res, preparedQuery);
};

module.exports = {
	loginFunction,
	post
};
