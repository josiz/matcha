const socket = require('socket.io');

const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const {tokenSecret} = require('./config.json');
const pool = require('./modules/dbConnect');
const { startWatchingDataUpdate } = require('geoip-lite');
const mysqlDatetime = require('./modules/mysqlDatetime');

// function auth(thetoken) {
// 	const authHeader = thetoken;
// 	const token = authHeader;
// 	if (!token) 
// 		return "no token error";

// 	else {
// 		jwt.verify(token, tokenSecret, (err, user) => {
// 			return user;

// 			if (err) 
// 				return "jwt error";
// 			else {
// 				pool.query(mysql.format('SELECT `online` FROM users WHERE id = ? AND login_id = ?;', [user.id, user.login_id]), (error, results) => {
// 					if (error || !results[0] || !results[0].online)
// 						return res.json('logged out');
// 					else {
// 						return user;
// 					}
// 				})
// 			}
// 		});
// 	}
// }

// preparedQuery = mysql.format(query, [req.user.id, parseInt(userId), mysqlDatetime()]);
// 		pool.query(preparedQuery, (error, results) => {
// 			if (error)
// 				return res.json(null);
// 			else
// 				return res.json('OK');



function addMessageToDatabase(myId, otherId, message, io, keys)
{
	const query = "SELECT * FROM blocks, likes  WHERE (blocker =? AND blockee = ?) OR (blocker = ? AND blockee = ?) OR (liker=? AND likee=? AND is_match=0) OR (liker=? AND likee=? AND is_match=0)";
	const prepareSql = mysql.format(query, [myId, otherId, otherId, myId, myId, otherId, otherId, myId]);
	pool.query(prepareSql, (error, results) => {
		if (results.length || error)
		{
			io.sockets.in(keys[myId]).emit('chat', {message: "empty", error: 'block', sender: myId});
			return false;
		}
		else
		{
			const query= "INSERT INTO messages (sender, recipient, content, timestamp) VALUES (?, ?, ?, ?)";
			const prepareSql = mysql.format(query, [myId, otherId, message, mysqlDatetime()]);
			pool.query(prepareSql, (error, results) => {
				if (error)
				{
					io.sockets.in(keys[myId]).emit('chat', {message: 'empty', error: 'database', sender: myId});
					return false;
				}
				else
				{

			

						io.sockets.in(keys[otherId]).emit('chat', {msg: message, sender: myId});
						io.sockets.in(keys[myId]).emit('chat', {msg: message, sender: myId});

					return true;
				}
			})
		}
	})




}

const wsServerInit = server => {

	const io = socket(server);
	const keys = [];
	

	io.on('connection', function(socket) {

			// function runs, when a new chat window is opened. Check that the opener is a legit user.
		socket.on('privateChat', function(data) {
			var temp;
			jwt.verify(data.me, tokenSecret, (err, user) => {
				if (!err)
					temp = user;   // VALIAIKAINEN!
			});
			keys[temp.id] = socket.id;  // VALIAIKAINEN!

			socket.join(keys[data.user]);
	
		})

			// function runs when a message is sent in an open chat window.
		socket.on('chat', async function(jees) {
			var temp;
			jwt.verify(jees.me, tokenSecret, (err, user) => {
				if (err)
				{
					return;
				}
				else
					temp = user;
			});

			addMessageToDatabase(temp.id, jees.id, jees.msg, io, keys);
			
			



			

			//io.emit('chat', {okei: 'jees'});

			//io.emit('chat', user);
		})

			// function runs when a user logs in. The wsId array updates here.
		socket.on('logIn', function(token) {
			var temp;
			jwt.verify(token.token, tokenSecret, (err, user) => {
				if (err)
				{
					return;
				}
				else
				{
					temp = user;
				}
			});
			keys[temp.id] = socket.id;
		})
			// function run when user logs out
		socket.on('logOut', function(data) {
			var temp;
			jwt.verify(data.user, tokenSecret, (err, user) => {
				if (err)
				{
					return;
				}
				else
				{
					temp = user;
				}
			});
			keys[temp.id] = '';
		})


	});







};








module.exports = wsServerInit;
