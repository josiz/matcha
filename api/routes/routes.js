const express = require('express');
const multer = require('multer');
const upload = multer({dest: 'tmp/'});

// Routes
const register = require('./register');
const login = require('./login');
const apiAuth = require('./apiAuth');
const logout = require('./logout');
const confirmEmail = require('./confirmEmail');
const forgotPassword = require('./forgotPassword');
const resetPassword = require('./resetPassword');
const search = require('./search');

const myProfile = require('./myProfile/profile');
const myPics = require('./myProfile/pics');
const photoActions = require('./myProfile/photoActions');
const likes = require('./myProfile/likes');
const visits = require('./myProfile/visits');
const matches = require('./myProfile/matches');
const notifications = require('./myProfile/notifications')

const profile = require('./profile');

const chat = require('./chat');
const map = require('./map');

const router = express.Router();

// Public routes

// search.js
router.get('/', function(req, res, next) {
	search.get(req, res, next);
});

// register.js
// router.get('/register', (req, res, next) => {
// 	register.get(req, res, next);
// });

router.post('/register', (req, res, next) => {
	register.post(req, res, next);
});

// login.js
// router.get('/login', (req, res, next) => {
// 	login.get(req, res, next);
// });

router.post('/login', (req, res, next) => {
	login.post(req, res, next);
});

// apiAuth.js
router.post('/apiLogin', (req, res, next) => {
	apiAuth.login(req, res, next);
});

router.post('/apiRegister', (req, res, next) => {
	apiAuth.register(req, res, next);
});

// logout.js
router.post('/logout', (req, res, next) => {
	logout.post(req, res, next);
});

// confirmEmail.js
router.post('/confirmEmail', (req, res, next) => {
	confirmEmail.post(req, res, next);
});

// forgotPassword.js
router.post('/forgotPassword', (req, res, next) => {
	forgotPassword.post(req, res, next);
});

// router.post('/forgotPassword', (req, res, next) => {
// 	forgotPassword.post(req, res, next);
// });

// resetPassword.js
// router.get('/resetPassword', (req, res, next) => {
// 	resetPassword.get(req, res, next);
// });

router.post('/resetPassword', (req, res, next) => {
	resetPassword.post(req, res, next);
});


// Private routes
// From here on in, everything probably requires the user to be logged in

// map.js
router.get('/map', (req, res, next) => {
	map.get(req, res, next);
});

// myProfile/profile.js
router.get('/myProfile/profile', (req, res, next) => {
	myProfile.get(req, res, next);
});

router.post('/myProfile/profile', (req, res, next) => {
	myProfile.post(req, res, next);
});

// myProfile/pics.js
router.get('/myProfile/pics', (req, res, next) => {
	myPics.get(req, res, next);
});

router.post('/myProfile/pics', upload.array('photos', 5), (req, res, next) => {
	myPics.post(req, res, next);
});

// myProfile/photoActions.js
router.post('/myProfile/photoActions', (req, res, next) => {
	photoActions.post(req, res, next);
});

// myProfile/notifications.js
router.get('/myProfile/notifications', (req, res, next) => {
	notifications.get(req, res, next);
});

router.get('/myProfile/longNotifications', (req, res, next) => {
	notifications.longGet(req, res, next);
});

// profile.js
router.get('/profile/:id', (req, res, next) => {
	profile.get(req, res, next);
});

router.post('/profile/:id', (req, res, next) => {
	profile.post(req, res, next);
});

// search.js
// router.get('/search', (req, res, next) => {
// 	search.get(req, res, next);
// });

// router.post('/search', (req, res, next) => {
// 	search.post(req, res, next);
// });

// likes.js
router.get('/myProfile/likes', (req, res, next) => {
	likes.get(req, res, next);
});

// visits.js
router.get('/myProfile/visits', (req, res, next) => {
	visits.get(req, res, next);
});

// chat.js
router.get('/chat', (req, res, next) => {
	chat.get(req, res, next);
});

router.post('/chat', (req, res, next) => {
	chat.post(req, res, next);
});

//matches.js getConnections
router.get('/getConnections', (req, res, next) => {
	matches.get(req, res, next);
});

router.get('/getLongConnections', (req, res, next) => {
	matches.getLong(req, res, next);
});

module.exports = router;
