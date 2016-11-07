var fs=require("fs");

//nodejs获取命令行参数的方法
console.log("第一个参数:"+process.argv[1]);
console.log("第二个参数:"+process.argv[2]);
console.log("第三个参数:"+process.argv[3]);

//同步读取文件
var txt=fs.readFileSync("test.txt","utf-8");
console.log(">>>>>>>>>>>>>>同步读取文件的内容\n");
console.log(txt.toString()+"\n");
console.log(">>>>>>>>>>>>>>同步读取文件结束");

//判断文件的类型
console.log("test.txt是文件："+fs.statSync("test.txt").isFile());
console.log("test.txt是目录："+fs.statSync("test.txt").isDirectory());

//判断文件是否存在
console.log("test.txt文件是否存在："+fs.existsSync("test.txt"));

//读取目录
var list=fs.readdirSync("E:\\渲染引擎\\工具集\\ppt制作\\test");
list.forEach(function(element, index) {
	console.log("目录中的文件："+element);
});