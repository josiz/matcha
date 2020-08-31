const mysql = require('mysql');
const fetch = require('node-fetch');
const FormData = require('form-data');

const config = require('../mailConfig.json');
const {loginFunction} = require('./login');

const returnMeEndpoint = (code, action) => {
	const data = new FormData();
	data.append('code', code);
	data.append('client_id', config["42clientId"]);
	data.append('client_secret', config["42clientSecret"]);
	data.append('grant_type', 'authorization_code');
	data.append('redirect_uri', config["42redirectUri" + action]);

	return new Promise((resolve, reject) => {
		fetch('https://api.intra.42.fr/oauth/token', {
			method: 'post',
			body: data
		})
			.then(response => response.json())
			.then(response => {
				fetch('https://api.intra.42.fr/v2/me?access_token=' + response.access_token)
					.then(response => response.json())
					.then(response => resolve(response))
					.catch(error => reject(error));
			})
			.catch(error => reject(error));
		});
};

const register = (req, res, next) => {
	if (!req.body.code)
		res.json(null);

	returnMeEndpoint(req.body.code, 'Register')
		.then(apiResponse => res.json({
			action: 'register',
			username: apiResponse.login,
			first_name: apiResponse.first_name,
			last_name: apiResponse.last_name,
			email: apiResponse.email
	}));
};

const login = async (req, res, next) => {
	if (!req.body.code)
		res.json(null);


	const apiResponse = await returnMeEndpoint(req.body.code, 'Login');

	const query = 'SELECT * FROM user_and_main_photo WHERE email = ?;';
	const preparedQuery = mysql.format(query, [apiResponse.email]);

	loginFunction(req, res, preparedQuery);
};

module.exports = {
	login,
	register
};
