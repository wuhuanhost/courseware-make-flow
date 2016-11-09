
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

var async = require('async');
var logger = require('./utils/log').logger("process.js");
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
var formPathTpl = path.resolve(__dirname, "../", "tpl", "ppt", "source");
var formPathImages = path.resolve(__dirname, "../", "data", "images");
var toPath = path.resolve(__dirname, "../", "output");



// 清空目录
function clean(cb) {
    console.log("正在清空output目录......");
    rmrf(toPath, {
        nosort: true,
        silent: true
    }, function (err) {
        if (err) {
             logger.error(err);
        } else {
            console.log("output目录清空完成......");
            if (cb != null) {
                cb();
            }
        }
    });
}

// 复制主题目录
function copyTpl(cb) {
    console.log("正在复制主题目录......");
    copy.copyDir(formPathTpl, toPath, function (err) {
        if (err) {
             logger.error(err);
        } else {
            console.log("主题文件复制完成......");
            cb();
        }
    });
}

//复制课件图片
function copyImages(cb) {
    console.log("正在复制课件图片目录......");
    copy.copyDir(formPathImages, toPath + "/images", function (err) {
        if (err) {
             logger.error(err);
        } else {
            console.log("图片复制完成......");
            cb();
        }
    });
}

// 生成课件的方法
function renderHtml() {
    logger.error("ddddddddddddd")
    async.series([clean, copyTpl, copyImages],
        function (err, values) {
            if (err) {
                 logger.error(err);
            } else {
                // console.log(values)
            }
        });
}



module.exports = {
    renderHtml: renderHtml,
    clean: clean
};