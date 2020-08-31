const mysql = require('mysql');
const pool = require('../modules/dbConnect');

const get = (req, res, next) => {
	if (!req.user)
		return res.json(null);
		
	const query = 'SELECT latitude, longitude FROM users WHERE ABS(latitude) > 0.0001 AND ABS(longitude) > 0.0001;';
	pool.query(query, (error, results) => {
		if (error || !results.length)
			return res.json(null);
		else
			return res.json({locations: results, lat: req.user.lat, lon: req.user.lon});
	});
};

module.exports = {
	get
};
