const getRootUrl = req => {
	return req.protocol + '://' + req.get('host');
};

module.exports = getRootUrl;
