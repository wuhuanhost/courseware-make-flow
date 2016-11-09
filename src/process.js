/// <reference path="../typings/index.d.ts" />
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
var ejs = require('ejs');

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
var tplPath = path.resolve(__dirname, "../", "tpl", "ppt", "layout", "_layout.ejs");


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
    async.series([clean, copyTpl, copyImages, readData],
        function (err, values) {
            if (err) {
                logger.error(err);
            } else {
                // console.log(values)
            }
        });
}


var txtPath = path.resolve(__dirname, "../", "data", "txt");

//课件数据结构
// var data = {
//     pages: [{
//         content: ["ppt第一页","ppt第二页","ppt第三页"
//         ],
//         index: 1, //第几页
//     }],
//     countPage: 100
// }

var data = {
    pages: [],
    countPage: 0
};

//读取data/txt中的所有的文件
function readData(callback) {
    fs.readdir(txtPath, function (err, list) {
        var len = list.length;
        data.countPage = len;
        var count = 0;
        async.whilst(function () {
            return count < len;
        }, function (cb) {
            count++;
            //读取文件
            var txt = fs.readFileSync(path.resolve(txtPath, list[count - 1])).toString();
            //调用txt2html方法
            var temp = {};
            temp.content = splitSection(txt);
            temp.index = count;
            data.pages.push(temp);
            cb(null, data);
        }, function (err, data) {
            render(data);
            callback();
        })
    });

}


/**
 * 
 */
function render(data) {
    for (var i = 0; i < data.pages.length; i++) {
        ejsRenderHtml(data.pages[i], (i + 1));
    }
}



/**
 * ejs渲染数据
 **/
function ejsRenderHtml(data, fileName) {
    logger.warn("正在生成  output\\" + fileName + ".html");
    ejs.renderFile(tplPath, data, function (err, str) {
        if (err) {
            console.log(err)
        }
        fs.writeFileSync('E:\\渲染引擎\\工具集\\新版课件制作工具\\output\\' + fileName + '.html', str);
    });
}



// txt2html测试方法
function txt2html(str) {
    var txtArr = str.split("\r\n");
    var str = "";
    for (var i = 0, len = txtArr.length; i < len; i++) {
        logger.debug(txtArr[i] + "   " + txtArr[i].match(/^##\s/g) + "         " + txtArr[i].match(/^#\s/g))
        if (txtArr[i].match(/^#\s/g) != null) {
            str += "<section><h1>" + txtArr[i].replace("#", "") + "</h1>";
        } else if (txtArr[i].match(/^##\s/g) != null) {
            str += "<section><h2>" + txtArr[i].replace("##", "") + "</h2>";
        } else if (txtArr[i].match(/^>/) != null) {
            str += "<p>" + txtArr[i].replace(">", "") + "</p>";
        }
        if (txtArr[i] === "") {
            str += "</section>";
        }
    }
    return str + "</section>"
}

/**
 * 分割每一页的数据按照<section>,然后放到一个数组中。
 */
function splitSection(txt) {
    var str = txt2html(txt);
    var content = [];
    var arr = str.match(/<section>.*?<\/section>/g);
    for (var i = 0, len = arr.length; i < len; i++) {
        content.push(arr[i]);
    }
    return content;
}





// readData();




module.exports = {
    renderHtml: renderHtml,
    clean: clean
};