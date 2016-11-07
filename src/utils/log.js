var log4js = require('log4js');
var path=require('path');
var log4jsConfPath=path.resolve(__dirname,'../','../','log4js.json');
var log4jsConf = require(log4jsConfPath);

log4js.configure(log4jsConf);

var logf=log4js.getLogger("file");
var logc=log4js.getLogger("console");

module.exports = {
	"file":logf,
	"console":logc
};