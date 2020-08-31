const crypto = require('crypto');
const {salt} = require('../config.json');

const hashPassword = (username, password) => {
	const concatSalt = salt + username;
	const hashedSalt = crypto.createHash('md5').update(concatSalt).digest('hex');
	return crypto.createHash('sha256').update(password + hashedSalt).digest('hex');
};

module.exports = hashPassword;
