const mysql = require('mysql');
const fs = require('fs');

const pool = require('../../modules/dbConnect');

const post = (req, res, next) => {
	if (!req.user || !req.body.action || !req.body.id)
		res.json(null);
	let query = '';
	if (req.body.action === 'delete')
		query = mysql.format('DELETE FROM user_photos WHERE user = ? AND id = ?;', [req.user.id, req.body.id]);
	else if (req.body.action === 'primary')
		query = mysql.format('UPDATE users SET main_pic = ? WHERE id = ? AND EXISTS (SELECT * FROM user_photos WHERE id = ? and user = ?);', [req.body.id, req.user.id, req.body.id, req.user.id]);
	
	if (!query.length)
		return res.json(null);

	pool.query(query, (error, result) => {
		if (error || !result.affectedRows)
			return res.json(null);
		else {
			if (req.body.action === 'delete') {
				fs.readdir('public/img/userPhotos/', (err, files) => {
					if (err)
						return res.json(null);
					const re = new RegExp('^' + req.body.id + '\.');
					for (let i = 0; i < files.length; ++i) {
						if (files[i].match(re))
							fs.unlinkSync('public/img/userPhotos/' + files[i]);
					}
				});
			}
			return res.json(null);
		}
	});
};

module.exports = {
	post
};
