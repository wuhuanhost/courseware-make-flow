var yaml = require('js-yaml');
var fs = require('fs');
var path = require('path');

// 配置文件的地址
function doc(sysConfigPath) {
    var confPath = path.resolve(sysConfigPath);
    var config = null;
    try {
        config = yaml.safeLoad(fs.readFileSync(confPath, 'utf8'));
    } catch (e) {
        console.log(e);
    }
    return config;
}

module.exports = doc;