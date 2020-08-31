const {validateCoordinate} = require('./getLoginCoordinates');

const mysql = require('mysql');

const validateAge = age => {
	return Number.isInteger(parseInt(age)) && parseInt(age) > 15 && parseInt(age) < 121;
};

const validatePassword = (password) => {
	let strength = 0;
	let characterGroups = [
		/[A-Z]/,
		/[a-z]/,
		/[0-9]/,
		/[`~!@#$%^&*()-_=+\[\]\\\{\}\|;':",.\/<>\?]/
	];

	if (password.length > 7 && password.length)
		characterGroups.forEach((regex) => strength += regex.test(password));
	return strength > 2;
};

const validateUsername = (username) => {
	// 4-16 characters, only alphas and numbers
	return /^[A-Za-z0-9]{4,16}$/.test(username);		
};

const validateEmail = (email) => {
	// RFC 2822
	const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
	return re.test(email);
};

const validateName = (name) => {
	const re = /^[\p{L}\-']{2,32}$/u;
	return re.test(name);
};

const validateGender = (gender, target = false) => {
	return gender === 'm' || gender === 'f' || (target && gender === 'mf') || (target && gender === 'fm');
};

const validateUserData = (user) => {
	let userIsValid = true;

	if (user.password) {
		if (!validatePassword(user.password))
			userIsValid = false;
	}
	if (user.username) {
		if (!validateUsername(user.username))
			userIsValid = false;
	}
	if (user.email) {
		if (!validateEmail(user.email))
			userIsValid = false;
	}
	if (user.firstName) {
		if (!validateName(user.firstName))
			userIsValid = false;
	}
	if (user.lastName) {
		if (!validateName(user.lastName))
			userIsValid = false;
	}

	return userIsValid;
};

const validateRegistrationData = (user) => {
	if (
		!user.username || !user.email || !user.firstName || !user.firstName ||
		!user.lastName || !user.password || !user.confirmPassword ||
		user.password !== user.confirmPassword
	)
		return false;

	return (
		validateUsername(user.username) && validateEmail(user.email) &&
		validatePassword(user.password) && validateName(user.firstName) &&
		validateName(user.lastName)
	);
};

const validateMyProfileData = user => {
	// Form is not filled
	if (!user.email || !user.firstName || !user.lastName || !user.age ||
		!user.gender || !user.target || !user.tags || !user.biography
	)
		return false;
	
	return (validateEmail(user.email) && validateName(user.firstName) &&
		validateName(user.lastName) && validateGender(user.gender, false) &&
		validateGender(user.target, true) && validateAge(user.age)
	);
};

const parseTags = arr => {
	const ret = arr.filter((element, index, arr) => element.length && arr.indexOf(element) === index);
	ret.forEach((element, index) => this[index] = mysql.escape(element));
	return ret;
};

const validateCoordinates = coords => {
	if (!validateCoordinate(coords.latitude) || !validateCoordinate(coords.longitude))
		return '';
	return `, latitude = ${coords.latitude}, longitude = ${coords.longitude}`;
};

module.exports = {
	validatePassword: validatePassword,
	validateUsername: validateUsername,
	validateEmail: validateEmail,
	validateName: validateName,
	validateUserData: validateUserData,
	validateRegistrationData,
	validateMyProfileData,
	validateGender,
	parseTags,
	validateCoordinates
};
