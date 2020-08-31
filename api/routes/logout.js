const mysql = require('mysql');
const pool = require('../modules/dbConnect');

const post = (req, res, next) => {
	if (!req.user)
		return res.json(null);
	let randomQuery = '\`online\` = \`online\` - 1';
	// Log user out from all devices (invalidate old JWTs)
	if (req.body.all)
		randomQuery = "\`online\` = 0, login_id = '" + Math.random().toString(36).slice(2) + "'";

	const query = mysql.format('UPDATE users SET ' + randomQuery + ' WHERE id = ?;', [req.user.id]);
	pool.query(query, (error, results) => {
		if (error)
			return res.json(null);
		else
			return res.json('OK');
	});
};

module.exports = {
	post
};
