var doc = require('./utils/read-config')
var log = require('./utils/log');
log.console.error(doc.tpl)
    /**
     * 数据处理引擎
     * @author will
     * @date 2016-11-03
     */
/**
 * 数据处理对象
 * @return {[type]} [description]
 */
function dataProcess() {
    console.log("数据处理对象实例化！！！");
    //初始化方法
    this.init = function() {
        console.log("读取系统配置文件config.yml");
    }
    this.init();
}

//1、加载系统配置文件
//2、加载模板文件
//3、获取


/**
 * js加载器方法，模板中通过此方法加载的js最后会被复制到output下的相对位置，例如tpl/js/a.js会复制到output/js/a.js
 * @param  path  tpl/js相对于tpl/layout的相对路径
 * @return {[type]}      [description]
 */
function js(path) {

}


/**
 * css加载器，和js加载器的作用类似
 * @param  path tpl/css相对于tpl/layout的相对路径
 * @return {[type]}      [description]
 */
function css(path) {


}


var dp = new dataProcess();

