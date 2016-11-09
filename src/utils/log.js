var log4js = require('log4js');
log4js.configure({
	appenders: [{
		type: 'console'
	}, {
		type: 'file',
		filename: 'logs/logger.log',
		maxLogSize: 10240,
		backups: 10
	}],
	replaceConsole: true
});

exports.logger = function (name) {
	console.log(arguments)
	var logger = log4js.getLogger(name);
	logger.setLevel('INFO');
	return logger;
}