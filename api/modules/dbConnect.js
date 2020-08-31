const mysql = require('mysql');
const config = require('../config.json');
const database = config.database;

const pool = mysql.createPool({
	host: database.host,
	user: database.user,
	password: database.password,
	database: database.database,
	connectionLimit: 5,
	multipleStatements: true
});

pool.on('connection', function(connection) {
	connection.on('error', function (err) {
		console.error(new Date(), 'DB error:', err.code, err.error);
	});
});

module.exports = pool;
