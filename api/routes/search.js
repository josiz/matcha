const mysql = require('mysql');

const pool = require('../modules/dbConnect');
const calculateDistance = require('../modules/calculateDistance');

const getGenderQueries = myData => {
	let ret = {};
	if (myData.target_genders.length === 2)
		ret.targets = '1=1';
	else
		ret.targets = `gender LIKE '${myData.target_genders}'`;

	ret.targetTargets = `target_genders LIKE '%${myData.gender}%'`;
	return ret;
}

const filterProfiles = (profiles, params, user) => {
	// Discarding users who haven't set an age (profile not completed)
	const nullAgeFiltered = profiles.filter(profile => profile.age);

	const ret = nullAgeFiltered.map(profile => {
		// Calculating distance for everyone
		let distance = calculateDistance(user.latitude, user.longitude, profile.latitude, profile.longitude);
		if (isNaN(distance))
			distance = 'Unknown';

		// Calculating number of tags in common
		const userTags = user.tags_string ? user.tags_string.split(',') : null;
		let commonTags = 0;
		let tags = [];
		const commonTagsList = [];
		if (profile.tags_string && userTags) {
			tags = profile.tags_string.split(',');
			tags.forEach(tag => {
				if (userTags.includes(tag)) {
					commonTags += 1;
					commonTagsList.push(tag);
				}
			});
		}

		const distanceNumber = typeof distance === 'number' ? distance : 1000;
		// Machine-learning powered matching algorithm result
		const matchRating = distanceNumber * distanceNumber -
			commonTags * commonTags * 1000 +
			Math.pow(profile.age - user.age, 4);
		return {...profile, distance: distance, commonTags: commonTags, commonTagsList: commonTagsList, tags: tags, matchRating: matchRating, password: '', email: '', email_confirmation_string: '', forgot_password_string: '', latitude: 0, longitude: 0, login_id: ''};
	});
	return ret;
};

const get = (req, res, next) => {	
	if (!req.user)
		return res.json(null);
	const query = mysql.format('SELECT * FROM user_and_main_photo WHERE id = ?;', [req.user.id]);
	
	pool.query(query, (error, result) => {
		if (error || !result)
			return res.json(null);
		if (!result[0])
			return res.json('empty');
		const myData = result[0];
		if (!myData.gender)
			return res.json('gender not set');
			
		const genderQueries = getGenderQueries(myData);
		const usersQuery = mysql.format(`SELECT * FROM user_and_main_photo \

		 WHERE ${genderQueries.targets} AND ${genderQueries.targetTargets} AND id != ? AND NOT EXISTS (SELECT * FROM likes WHERE likes.liker=? AND likes.likee=user_and_main_photo.id) AND NOT EXISTS (SELECT * FROM blocks WHERE blocker=user_and_main_photo.id AND blockee=?);`, [req.user.id, req.user.id, req.user.id]);
		
		 pool.query(usersQuery, (error, results) => {
			if (error)
				return res.json(null);
			return res.json(filterProfiles(results, req.params, result[0]));
		});
	});
};

// const post = (req, res, next) => {
	
// };

module.exports = {
	get
	//post
};
