var ejs = require('ejs');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var data1 = {
    "title": "标题",
    "content": ["测试1", "测试2", "测试3"]
};

//课件数据结构
var data = {
    pages: [{
        content: [{
            block: ["<h1>第一行</h2>", "<p>第二行</p>"],
            index: 1
        }],
        index: 1, //第几页
    }],
    countPage: 100
}

var ejsPath = './a.ejs';




var options = {
    strict: true
};

ejs.renderFile(ejsPath, data1, function (err, str) {
    if (err) {
        console.log(err)
    }
    fs.writeFileSync('./a.html', str);

});




