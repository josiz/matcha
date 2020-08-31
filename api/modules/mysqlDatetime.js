const mysqlDatetime = (date = null) => {
	if (!date)
		date = new Date();
	return date.toISOString().slice(0, 19).replace('T', ' ');
};

module.exports = mysqlDatetime;
