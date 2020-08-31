const mysql = require('mysql');
const config = require('./config.json');
const database = config.database;

const initialiseDb = () => {
	const connection = mysql.createConnection({
		host: database.host,
		user: database.user,
		password: database.password,
		connectionLimit: 5,
		multipleStatements: true
	});

	const query = `
DROP DATABASE IF EXISTS matcha;

CREATE DATABASE IF NOT EXISTS matcha;

USE matcha;

CREATE TABLE IF NOT EXISTS users (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(24) UNIQUE NOT NULL,
	\`password\` CHAR(64),
	email VARCHAR(99) UNIQUE NOT NULL,
	first_name VARCHAR(32) NOT NULL,
	last_name VARCHAR(32) NOT NULL,
	age INT DEFAULT NULL,
	fame INT DEFAULT 0,
	gender VARCHAR(1) DEFAULT '0',
	target_genders VARCHAR(2) DEFAULT 'fm',
	biography TEXT,
	email_confirmation_string VARCHAR(64),
	forgot_password_string VARCHAR(64) DEFAULT NULL,
	longitude FLOAT DEFAULT NULL,
	latitude FLOAT DEFAULT NULL,
	last_login DATETIME DEFAULT NULL,
	main_pic INT UNSIGNED DEFAULT NULL,
	\`online\` INT DEFAULT 0,
	login_id TEXT DEFAULT (UUID())
);

CREATE TABLE IF NOT EXISTS user_photos (
	\`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	\`user\` INT UNSIGNED,
	\`extension\` VARCHAR(16),
	FOREIGN KEY (\`user\`) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS tags (
	string VARCHAR(256),
	user INT UNSIGNED,
	PRIMARY KEY (string, user),
	FOREIGN KEY (user) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS likes (
	liker INT UNSIGNED NOT NULL,
	likee INT UNSIGNED NOT NULL,
	is_match BOOLEAN DEFAULT FALSE,
	timestamp DATETIME NOT NULL DEFAULT '2020-08-20 08:39:26',
	PRIMARY KEY (liker, likee),
	FOREIGN KEY (liker) REFERENCES users(id),
	FOREIGN KEY (likee) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS unlikes (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	unliker INT UNSIGNED NOT NULL,
	unlikee INT UNSIGNED NOT NULL,
	timestamp DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS visits (
	visitor INT UNSIGNED NOT NULL,
	visitee INT UNSIGNED NOT NULL,
	\`time\` DATETIME NOT NULL,
	PRIMARY KEY (visitor, visitee),
	FOREIGN KEY (visitor) REFERENCES users(id),
	FOREIGN KEY (visitee) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS messages (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	sender INT UNSIGNED NOT NULL,
	recipient INT UNSIGNED NOT NULL,
	content VARCHAR(512) NOT NULL,
	timestamp DATETIME NOT NULL DEFAULT '2020-08-20 08:39:26',
	FOREIGN KEY (sender) REFERENCES users(id),
	FOREIGN KEY (recipient) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS blocks (
	id INT AUTO_INCREMENT PRIMARY KEY,
	blocker INT UNSIGNED NOT NULL,
	blockee INT UNSIGNED NOT NULL,
	\`time\` DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS reports (
	id INT AUTO_INCREMENT PRIMARY KEY,
	reporter INT UNSIGNED NOT NULL,
	reportee INT UNSIGNED NOT NULL,
	\`time\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(),
	FOREIGN KEY (reporter) REFERENCES users(id),
	FOREIGN KEY (reportee) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS notifications (
	id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
	user INT UNSIGNED NOT NULL,
	reason ENUM('like', 'unlike', 'visit', 'msg', 'match') NOT NULL,
	causer INT UNSIGNED NOT NULL,
	\`read\` BOOLEAN DEFAULT FALSE,
	\`time\` DATETIME DEFAULT CURRENT_TIMESTAMP(),
	FOREIGN KEY (user) REFERENCES users(id),
	FOREIGN KEY (causer) REFERENCES users(id)
);

CREATE TRIGGER notify_on_like AFTER INSERT ON likes FOR EACH ROW BEGIN
	DELETE FROM notifications WHERE \`user\` = new.likee AND (reason = 'like' OR reason = 'match') AND causer = new.liker;
	SET @likeType = IF((SELECT COUNT(*) FROM likes WHERE liker = new.likee AND likee = new.liker), 'match', 'like');
	INSERT INTO notifications (user, reason, causer, \`time\`) VALUES (new.likee, @likeType, new.liker, new.timestamp);
END;

CREATE TRIGGER delete_like_on_unlike BEFORE INSERT ON unlikes FOR EACH ROW BEGIN
	DELETE FROM likes WHERE liker = new.unliker AND likee = new.unlikee;
	DELETE FROM notifications WHERE user = new.unlikee AND reason = 'unlike' AND causer = new.unliker;
	INSERT INTO notifications (user, reason, causer, \`time\`) VALUES (new.unlikee, 'unlike', new.unliker, new.timestamp);
END;

CREATE TRIGGER notify_on_visit AFTER INSERT ON visits FOR EACH ROW BEGIN
	DELETE FROM notifications WHERE user = new.visitee AND reason = 'visit' AND causer = new.visitor;
	INSERT INTO notifications (user, reason, causer, \`time\`) VALUES (new.visitee, 'visit', new.visitor, new.\`time\`);
END;

CREATE TRIGGER notify_on_message AFTER INSERT ON messages FOR EACH ROW BEGIN
	DELETE FROM notifications WHERE \`user\` = new.recipient AND reason = 'msg' AND causer = new.sender;
	INSERT INTO notifications (user, reason, causer, \`time\`) VALUES (new.recipient, 'msg', new.sender, new.timestamp);
END;

-- Passwords are '123'


INSERT INTO users (username, \`password\`, email, first_name, last_name, gender, age, latitude, longitude) VALUES
	('admin1', 'ad9b191cd8d24d4e57710893f9922c11c6aeb8143ec99baf4332f191c6bfba9c', 'admin1@example.com', 'Admin', 'One', 'm', 21, 60, 34),
	('admin2', 'b0b46aaf9bab6524f15c40e3c82febe1bbad1f5cb87def29023f3303edd709f1', 'admin2@example.com', 'Admin', 'Two', 'f', 23, 65, 35),
	('test', '09d40999b9d76c0de6b1bb578be88f82fe345cb1aa384dffcdecd365bcd0c1e2', 'test@example.com', 'test', 'asd', 'f', NULL, 55, 24),
	('test2', 'cfeb5fa5031894f731dc34c689dea99358e8809dbedbab027a92c3a509712193', 'test2@example.com', 'test1', 'bsddd', 'f', 25, -23, -170),
	('test3', 'fdab214d25d419336ad2ae505dac5443ec3b322df5a412d17c28f8a31294b0d5', 'test3@example.com', 'test3', 'csddd', 'm', 27, -30, 23),
	('test4', 'a0287221a39411046400d08d97a56aa47901168dcf5dc7e56047966e3a3a49f7', 'test4@example.com', 'test4', 'dsddd', 'm', 29, 70, -45),
	('test5', '588c4b81a8a1042addabeddc9e784fb052108452b5ce943d2c47a30212fc8ad3', 'test5@example.com', 'test5', 'esddd', 'f', 31, 64, 35),
	('test6', '01fc82a9449df43ee2c89a97ad22ed2b10226fb78011cfe5b99be2fedec043a0', 'test6@example.com', 'test6', 'fsddd', 'm', 33, 64, 38);


INSERT INTO likes (liker, likee, is_match) VALUES 
	(1, 2, 1),
	(2, 1, 1),
	(1, 3, 1),
	(3, 1, 1),
	(1, 4, 1),
	(4, 1, 1),
	(5, 1, 0),
	(3, 2, 0),
	(3, 4, 0),
	(6, 2, 0);

INSERT INTO visits (visitor, visitee, time) VALUES
(4, 1, '2020-08-20 08:39:26'),
(4, 2, '2020-08-20 08:39:26'),
(4, 3, '2020-08-20 08:39:26'),
(1, 2, '2020-08-20 08:39:26'),
(1, 3, '2020-08-20 08:39:26'),
(2, 3, '2020-08-20 08:39:26'),
(2, 5, '2020-08-20 08:39:26'),
(1, 6, '2020-08-20 08:39:26'),
(6, 1, '2020-08-20 08:39:26'),
(3, 1, '2020-08-20 08:39:26');

INSERT INTO messages (sender, recipient, content) VALUES
(1, 2, "hello world"),
(2, 1, "ping"),
(1, 2, "pong"),
(1, 3, "asd"),
(1, 4, "123"),
(1, 5, "wow");

CREATE VIEW user_and_photos AS
SELECT * FROM users
LEFT OUTER JOIN (SELECT id AS photo_id, user, CONCAT(id, '.', extension) AS \`filename\` FROM user_photos) AS user_photos
ON user_photos.user = users.id;

CREATE VIEW user_and_main_photo AS
SELECT * FROM users
LEFT OUTER JOIN (SELECT id AS photo_id, user as p_user, CONCAT(id, '.', extension) AS \`filename\` FROM user_photos) AS user_photos
ON user_photos.p_user = users.id AND user_photos.photo_id = users.main_pic
LEFT OUTER JOIN (SELECT \`user\` AS tag_user, GROUP_CONCAT(string SEPARATOR ',') AS tags_string FROM tags GROUP BY tag_user) AS tags
ON tags.tag_user = users.id
LEFT OUTER JOIN (SELECT \`user\` AS photos_user, GROUP_CONCAT(id, '.', extension SEPARATOR ',') AS photos_string FROM user_photos GROUP BY \`user\`) AS photos
ON photos.photos_user = users.id;

CREATE VIEW chat_and_user AS
SELECT messages.id AS id, messages.content AS content, s.username AS sender_name, s.id AS sender_id, r.username AS recipient_name, r.id AS recipient_id FROM messages
JOIN users AS s ON s.id = messages.sender
JOIN users AS r ON r.id = messages.recipient;



INSERT INTO blocks (blocker, blockee, time) VALUES (0, 0, '2020-08-20 08:39:26');



-- DROP USER 'dbuser'@'%';
-- CREATE USER 'dbuser'@'%' IDENTIFIED WITH mysql_native_password BY '123dbuser';
-- GRANT ALL PRIVILEGES ON *.* TO 'dbuser'@'%';
`;
	connection.query(query);
};

module.exports = initialiseDb;
