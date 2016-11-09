var yaml = require('js-yaml');
var fs   = require('fs');
var path = require('path');

// 配置文件的地址
var confPath = path.resolve(__dirname, '../','../', 'config.yml');

var doc = null;

try {
     doc = yaml.safeLoad(fs.readFileSync(confPath, 'utf8'));
} catch (e) {
    console.log(e);
}

module.exports = doc;


