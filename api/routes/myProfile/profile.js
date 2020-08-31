const mysql = require('mysql');

const {validateMyProfileData, parseTags, validateCoordinates} = require('../../modules/validateUserData');
const pool = require('../../modules/dbConnect');
const {generateJWT} = require('../../modules/authentication');

const get = (req, res, next) => {
	// User is not logged in
	if (!req.user)
		return res.json(null);

	// I wonder if doing some kind of join here would make more sense
	const query = mysql.format('SELECT * FROM users WHERE id = ?;', [req.user.id]);
	pool.query(query, (error, results) => {
		if (error || !results)
		return res.json(null);

		const tagsQuery = mysql.format('SELECT string FROM tags WHERE user = ?;', [req.user.id]);
		pool.query(tagsQuery, (tagsError, tagsResults) => {
			if (tagsError)
				return res.json(null);

			const imgQuery = mysql.format('SELECT * FROM user_photos WHERE user = ?;', [req.user.id]);
			pool.query(imgQuery, (error, imagesResults) => {
				if (error)
					return res.json(null);

				return res.json({
					userData: {...results[0], password: ''},
					biography: escape(results[0].biography) || '',
					tags: tagsResults.map(tag => tag.string),
					images: imagesResults
				});
			});
		});
	});
};

const post = (req, res, next) => {
	// User is not logged in
	if (!req.user)
		return res.json(null);

	// Profile is not filled completely/correctly
	if (!validateMyProfileData(req.body))
		return res.json(null);

	// Remove duplicate and empty tags
	const tags = parseTags(req.body.tags);

	// Check if input coordinates are valid and update them if necessary
	// If input is invalid, updatedCoordinates will be empty
	const updatedCoordinates = validateCoordinates(req.body);
	
	// Query first updates the users table, then flushes all of the user's
	// tags from the tags table and adds fresh entries to the tags table

	const query = `
UPDATE users
	SET email = ?, first_name = ?, last_name = ?, gender = ?, target_genders = ?,
		biography = ? ${updatedCoordinates}, age = ?
	WHERE id = ?;
DELETE FROM tags WHERE user = ?;` + generateTagsQuery(tags, req.user.id);
	const preparedQuery = mysql.format(query,
		[
			req.body.email, req.body.firstName, req.body.lastName,
			req.body.gender, req.body.target, req.body.biography,
			parseInt(req.body.age), req.user.id, req.user.id
		]
	);

	let newTokenData = {
		user: req.user.user,
		id: req.user.id,
		lat: req.user.lat,
		lon: req.user.lon,
		login_id: req.user.login_id,
		tags: tags
	};

	if (updatedCoordinates.length) {
		newTokenData = {...newTokenData, lat: parseFloat(req.body.latitude), lon: parseFloat(req.body.longitude)};
	};

	pool.query(preparedQuery, (error) => {
		if (error) {
			return res.json(null);
		}
		else
			return res.json({...newTokenData, token: generateJWT(newTokenData)});
	});
};

const generateTagsQuery = (tags, id) => {
	if (!tags)
		return '';

	const insertStrings = tags.map(element => "('" + element + "', " + id + ')');
	const insertStringsJoined = insertStrings.join(',');
	return `INSERT INTO tags(string, user) VALUES ` + insertStringsJoined + ';';
};

module.exports = {
	get,
	post
};
