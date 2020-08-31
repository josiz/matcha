const nodemailer = require('nodemailer');
const mailConfig = require('../mailConfig.json');

const transporter = nodemailer.createTransport(mailConfig);

const sendEmail = (to, subject, content, html) => {
	const email = {
		from: mailConfig.auth.user,
		to: to,
		subject: subject,
		... html ? {html: content} : {text: content}
	};

	transporter.sendMail(email, (err, info) => {
		if (err)
			console.log(err);
	});
};

module.exports = sendEmail;
