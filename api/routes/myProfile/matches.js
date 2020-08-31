const mysql = require('mysql');
const pool = require('../../modules/dbConnect');
const mysqlDatetime = require('../../modules/mysqlDatetime');

const query = `SELECT users.id, users.username, users.online, users.filename
FROM user_and_main_photo AS users INNER JOIN likes ON users.id=likes.likee 
WHERE likes.is_match=1 AND likes.liker=?;`;

const get = (req, res, next) => {
	if (!req.user)
        res.json(null);

    var userId = req.user.id;

    const prepareSql = mysql.format(query, [userId]);

    pool.query(prepareSql, (error, results) => {
        if (error)
            return res.json("query returned error");
        else
        {
            return res.json(results);
        }
    });
}

const intervalQuery = (id, time) => {
	return new Promise((resolve, reject) => {
		pool.query(mysql.format(query, [id, time]), (error, results) => {
			if (error)
				resolve([]);
			else
				resolve(results);
		});
	});
};

const getLong = (req, res, next) => {
	if (!req.user)
		return res.json(null);
	const currentTime = mysqlDatetime();
    let i = 0;
	const longInterval = setInterval(() => {
        ++i;
		const results = intervalQuery(req.user.id, currentTime);
		results.then(result => {
			if (result.length != req.query.count || i == 30) {
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
    getLong
};
