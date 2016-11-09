'use strict';



var logger = require('./src/utils/log').logger("index.js");

var control=require('./src/process');

//参数列表
var argvs = process.argv;

var len = argvs.length;

argvs.forEach(function (argv, index) {
    logger.info("第" + (index + 1) + "个参数为:" + argv);
}, this);
console.log(">>>>>>>>>>>>>>>>>>>>>>>>>");

//三个参数
if (len === 3) {
    if (argvs[2] == "--g") {
        //生成页面
        logger.warn("生成页面");
        control.renderHtml();
    } else if (argvs[2] === "--s") { //启动服务器，使用配置文件中的端口号，配置文件中的端口号为空使用默认端口9696
        /**
         * 启动服务
         **/
        logger.warn("启动web服务器");
    } else if (argvs[2] == "--c") {
        //清空output目录
        logger.warn("清空output目录");
        control.clean(null);
    }

}


