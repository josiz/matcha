const mysql = require('mysql');
const pool = require('../modules/dbConnect');

const get = (req, res, next) => {
	if (!req.user || (!req.query.id && !req.query.id !== '0'))
		return res.json(null);
	const query = 'SELECT * FROM chat_and_user WHERE ((sender_id = ? OR sender_id = ?) AND (recipient_id = ? OR recipient_id = ?)) ORDER BY id;';
	pool.query(mysql.format(query, [req.user.id, parseInt(req.query.id), req.user.id, parseInt(req.query.id)]), (error, results) => {
		if (error)
			return res.json(null);
		else
			return res.json(results);
	});
};

const post = (req, res, next) => {
	return res.json(null);
};

module.exports = {
	get,
	post
};
