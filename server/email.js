var nodemailer = require('nodemailer');

var defaultConfig = {};
try {
  defaultConfig = require('./config.json')
}
catch (e) {
  console.error('Failed to read server/config.json:');
  console.error(e);
}

var transporter = nodemailer.createTransport({
	service: defaultConfig.EMAIL_SERVICE || process.env.EMAIL_SERVICE,
	auth: {
		user: defaultConfig.EMAIL_USERNAME || process.env.EMAIL_USERNAME,
		pass: defaultConfig.EMAIL_PASSWORD || process.env.EMAIL_PASSWORD
	}
});

module.exports = function(options, callback) {
	var mailOptions = {
		from: defaultConfig.EMAIL_USERNAME || process.env.EMAIL_USERNAME,
		replyTo: options.replyTo,
		to: options.to || defaultConfig.EMAIL_USERNAME || process.env.EMAIL_USERNAME,
		subject: options.subject,
		text: options.text
	};
	transporter.sendMail(mailOptions, function(err) {
		if (err) {
      console.error(err);
      callback('Failed to send message. Please try again later!');
		} else {
      callback();
		}
	});
};
