// const genderConstants = {
// 	'male': 3,
// 	'female': 2,
// 	'both': 6,
// 	'null': 0	
// };

const getGenderEmoji = gender => {
	if (gender.length === 2)
		return '⚥';
	else if (gender === 'm')
		return '♂️'
	else if (gender === 'f')
		return '♀️'
	return '';
}

module.exports = {
	getGenderEmoji
	// genderConstants
};
