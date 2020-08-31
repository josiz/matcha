const mysql = require('mysql');
const crypto = require('crypto');

const {validateRegistrationData} = require('../modules/validateUserData');
const pool = require('../modules/dbConnect');
const hashPassword = require('../modules/hash');
const sendEmail = require('../modules/mail');
const getRootUrl = require('../modules/getRootUrl');

/* GET registration page */
// const get = (req, res, next) => {
// 	// User is already logged in
// 	if (req.user)
// 		return res.status(301).redirect('/');

// 	res.render('register');
// };

/* POST to registration page (attempt to register new account) */
const post = (req, res, next) => {
	// User is already logged in
	if (req.user)
		return res.json(null);

	if (!validateRegistrationData(req.body))
		return res.json(null)
	else {
		const query = ' \
			INSERT INTO `users` SET \
				username = ?, password = ?, email = ?, first_name = ?, \
				last_name = ?, email_confirmation_string = ?; \
		';
		const emailConfirmationString = crypto.createHash('sha256')
			.update('req.body.email' + new Date()).digest('hex');
		const userData = [
			req.body.username,
			hashPassword(req.body.username, req.body.password),
			req.body.email,
			req.body.firstName,
			req.body.lastName,
			emailConfirmationString
		];

		const rootUrl = getRootUrl(req);
		const confirmationUrl = rootUrl + '/confirmEmail?user=' + req.body.username + '&token=' + emailConfirmationString;

		const emailContent = `
<p>Thanks for registering to Matcha! To confirm your registration, click the following link:</p>
<p><a href='${confirmationUrl}'>${confirmationUrl}</a></p>
`;

		const preparedQuery = mysql.format(query, userData, true);
		pool.query(preparedQuery,
			(error, results, fields) => {
				// Insert failed probably because of email/username clash
				if (error) {
					return res.json(null);
				}
				else {
					sendEmail(req.body.email, 'Matcha | Confirm your email', emailContent, true);
					return res.json('OK');
				}
			}
		);
	};
};

module.exports = {
	// get,
	post
};
