const mysql = require('mysql');
const {validateRegistrationData} = require('../modules/validateUserData');
const pool = require('../modules/dbConnect');
const hashPassword = require('../modules/hash');

const get = (req, res, next) => {
	
};

const post = (req, res, next) => {
	
};

module.exports = {
	get,
	post
};
