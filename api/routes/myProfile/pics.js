const mysql = require('mysql');
const fs = require('fs');

const pool = require('../../modules/dbConnect');

const post = (req, res, next) => {
	if (!req.user)
		return res.json(null);
	const query = 'SELECT COUNT(id) AS count FROM user_photos WHERE `user` = ?;';
	let imageCount = 0;
	pool.query(mysql.format(query, [req.user.id]), (error, result) => {
		if (error) {
			return res.json(null);
		}
		else
			imageCount = result[0].count;
		
		// Loop through images, insert them to database, and rename
		for (let i = 0; i + imageCount < 5; ++i) {
			if (!req.files || !req.files[i] || !req.files[i].mimetype.startsWith('image/'))
				break;
			let extension = req.files[i].mimetype.split('/')[1];
			if (!/^[a-zA-Z]+/.test(extension))
				break;
			const insertQuery = 'INSERT INTO user_photos (`user`, `extension`) VALUES (?, ?);';
			let preparedQuery = mysql.format(insertQuery, [req.user.id, extension]);
			let filename = '';
			pool.query(preparedQuery, (error, result) => {
				if (error) {
					return res.json(null);
				}
				else {
					filename = result.insertId;
					fs.renameSync(req.files[i].path, `public/img/userPhotos/${filename}.${extension}`);
					
					// User uploads their first image, make that default
					if (!imageCount) {
						const defaultQuery = mysql.format(`UPDATE users SET main_pic = ${filename} WHERE id = ?;`, [req.user.id]);
						pool.query(defaultQuery);
					}
				}
			});
		}
		return res.json('OK');
	});
};

module.exports = {
	post
};
