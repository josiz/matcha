const mysql = require('mysql');
const pool = require('../../modules/dbConnect');
const mysqlDatetime = require('../../modules/mysqlDatetime');

const notificationsColumns = 'notifications.id AS id, username, filename, `read`, `time`, reason'

const get = (req, res, next) => {
	if (!req.user)
		return res.json(null);
	const query = 'SELECT ' + notificationsColumns + ' FROM notifications JOIN user_and_main_photo AS users ON users.id = causer WHERE user = ? ORDER BY id ASC;';
	pool.query(mysql.format(query, [req.user.id]), (error, results) => {
		if (error)
			return res.json(null);
		else {
			if (req.query.read) {
				const readQuery = 'UPDATE notifications SET `read` = 1 WHERE user = ?;';
				// Don't need callback as this is not critical
				pool.query(mysql.format(readQuery, [req.user.id]));
			}
			return res.json(results);
		}
	});
};

const intervalQuery = (id, time) => {
	const query = 'SELECT ' + notificationsColumns + ' FROM notifications JOIN user_and_main_photo AS users ON users.id = causer WHERE user = ? AND ? < `time` ORDER BY id ASC;';
	return new Promise((resolve, reject) => {
		pool.query(mysql.format(query, [id, time]), (error, results) => {
			if (error)
				resolve([]);
			else
				resolve(results);
		});
	});
};

const longGet = (req, res, next) => {
	if (!req.user)
		return res.json(null);
	const currentTime = mysqlDatetime();
	let i = 0;
	const longInterval = setInterval(() => {
		++i;
		const results = intervalQuery(req.user.id, currentTime);
		results.then(result => {
			if (result.length || i == 30) {
				clearInterval(longInterval);
				if (!result.length) {
					return res.json([]);
				}
				return res.json(result);
			}
		});
	}, 1000);
}

module.exports = {
	get,
	longGet
};
