#! /usr/bin/env node
'use strict';
var logger = require('./src/utils/log').logger("index.js");
var control = require('./src/process');
var program = require('commander');

program
    .version('0.0.1')
    .option('-g, --generator', '生成课件')
    .option('-s, --server', '启动server......')
    .option('-c, --clean', '清空output目录')
    .parse(process.argv);

if (program.clean) {
    console.log('  - 清空目录');
    control.clean(null);
}

if (program.generator) {
    console.log('  - 生成课件......');
    control.renderHtml();
}

if (program.server) {
    console.log('  - 启动服务器......');
    control.startServer()
}


//console.log("---------------------------------------------------------------------------------------------------------------------------------------");
// //参数列表
// var argvs = process.argv;
// var len = argvs.length;

// argvs.forEach(function (argv, index) {
//     logger.info("第" + (index + 1) + "个参数为:" + argv);
// }, this);
// console.log(">>>>>>>>>>>>>>>>>>>>>>>>>");

// //三个参数
// if (len === 3) {
//     if (argvs[2] == "--g") {
//         //生成页面
//         logger.warn("生成页面");
//         control.renderHtml();
//     } else if (argvs[2] === "--s"||argvs[2] === "server") { //启动服务器，使用配置文件中的端口号，配置文件中的端口号为空使用默认端口9696
//         /**
//          * 启动服务
//          **/
//         logger.warn("启动web服务器");
//         control.startServer()
//     } else if (argvs[2] == "--c"||argvs[2] == "clean") {
//         //清空output目录
//         logger.warn("清空output目录");
//         control.clean(null);
//     }

// }
//console.log("---------------------------------------------------------------------------------------------------------------------------------------");


/**
 * 箭头函数的使用
 */
var fun = (a, b) => {
    return a + b;
}

var arr = [1, 2, 3];

// console.log(arr.reduce(fun));