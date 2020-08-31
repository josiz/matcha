const mysql = require('mysql');
const pool = require('../../modules/dbConnect');

const processVisits = (results, userId) => {
	const ret = {
		visited: [],
		visitedMe: []
	}

	results.forEach(element => {
		if (element.visitor === userId)
			ret.visited.push(element);
		else
			ret.visitedMe.push(element);
	});

	return ret;
}

const get = (req, res, next) => {
	if (!req.user)
		res.json(null);

	const selectvisitor = 'visitor.username AS visitorUsername, visitor.fame AS visitorFame, visitor.id AS visitor, visitor.first_name as visitorFName, visitor.last_name as visitorLName, \
	visitor.latitude as visitorLat, visitor.longitude as visitorLon, visitor.main_pic AS visitorPic, visitor.filename AS visitorPhoto';
	const selectvisitee = selectvisitor.split("visitor").join("visitee");
	const select = selectvisitor + ', ' + selectvisitee;

	const query = 'SELECT ' + select + ' FROM visits \
		INNER JOIN user_and_main_photo AS visitor ON visitor.id = visits.visitor \
		INNER JOIN user_and_main_photo AS visitee ON visitee.id = visits.visitee \
		WHERE (visits.visitor = ? OR visits.visitee = ?) AND NOT EXISTS (SELECT * FROM blocks WHERE (blocker=visits.visitor OR blocker=visits.visitee) AND blockee=?);'
		//ORDER BY FIELD(visitor, ?);'
		// INNER JOIN user_and_main_photo AS 
	const preparedQuery = mysql.format(query, [req.user.id, req.user.id, req.user.id]);
	pool.query(preparedQuery, (error, results) => {
		if (error)
			return res.json(null);
		else if (!results.length)
			return res.json('empty');
		else
			return res.json(processVisits(results, req.user.id));
	});
};


module.exports = {
	get
};
