/*!
 * 数据处理引擎
 * @author will
 * @date 2016-11-03
 */
var path = require('path');
var fs = require('fs');
var rmrf = require('rimraf')
var doc = require('./utils/read-config')
    // var log = require('./utils/log');
var copy = require('./utils/copy-file-dir');


// log.console.error(doc.tpl)

/**
 * 数据处理对象
 * @return {[type]} [description]
 */
function dataProcess() {
    console.log("数据处理对象实例化！！！");
    //初始化方法
    this.init = function () {
        console.log("读取系统配置文件config.yml");
    }
    this.init();
}

//1、加载系统配置文件
//2、加载模板文件
//3、获取






var dp = new dataProcess();
var formPath = path.resolve(__dirname, "../", "tpl", "ppt", "source");
var toPath = path.resolve(__dirname, "../", "output");


    rmrf(toPath,{ nosort: true, silent: true },function(err){
console.log(err);

    });



// console.log(formPath);
// console.log(toPath);
// console.log("正在复制主题文件......");
// copy.copyDir(formPath, toPath, function (err) {
//     if (err) {
//         console.log(err);
//     }
// console.log("主题文件复制完成......");
// });