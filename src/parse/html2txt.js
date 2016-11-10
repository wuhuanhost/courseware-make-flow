/***************************************************/
//名称：html2txt
//程序用途:
//  将html文件内容转为ppt标记语言的文本
//用法：
//  node html2txt.js xxx.html [xxx.txt]
/***************************************************/


var fs=require("fs");
var argv=process.argv;

//获取命令行参数
var inputFileName=(argv[2]);            //输入文件名
var outputFileName=(argv[3]);           //输出文件名
var imgDir="images/";                      //设定图片路径

//判断文件类型
// if(inputFileName==undefined||!inputFileName.match(/.html$/))
// {
//     console.log("文件类型错误，请确认文件类型是否正确！")
//     return;
// }

// //默认使用源文件名前缀来命名
// if(outputFileName==undefined||outputFileName=='')
// {
//     outputFileName=inputFileName.replace(/\.html$/,".txt");     
// }

// try{
//     var htmlData=fs.readFileSync(inputFileName).toString();
//     var matchData=htmlData.match(/<body>([\s\S]*?)<\/body>/)
//     if(matchData==null)
//     {
//         console.log("没有找到body标签！");
//         return;
//     }
//     var result=parseHtml(matchData[1].replace(/\s*\r\s*|\s*\n\s*/g,""));
//     console.log(result)
//     fs.writeFileSync(outputFileName,result);
// }
// catch(e){
//     console.log("打开文件出错!");
//     console.log(e);
// }

function html2txt(inputFileName,outputFileName){
    //判断文件类型
    if(inputFileName==undefined||!inputFileName.match(/.html$/)){
        console.error("文件类型错误，请确认文件类型是否正确！")
        return;
    }
    //默认使用源文件名前缀来命名
    if(outputFileName==undefined||outputFileName==''){
        outputFileName=inputFileName.replace(/\.html$/,".txt");     
    }
    try{
        var htmlData=fs.readFileSync(inputFileName).toString();
        var matchData=htmlData.match(/<body>([\s\S]*?)<\/body>/)
        if(matchData==null){
            console.warn("没有找到body标签！");
            return;
        }
        var result=parseHtml(matchData[1].replace(/\s*\r\s*|\s*\n\s*/g,""));
        // console.log(result)
        fs.writeFileSync(outputFileName,result);
    }
    catch(e){
        console.error("打开文件出错!");
        console.error(e);
    }
}

module.exports=html2txt;

/**
 * 将html变成txt
 * @param htmlStr   需要分析的html字符串
 * @returns 返回特殊标记的txt文本文件
 */
function parseHtml(htmlStr)
{
    var txtAndTables=splitTables(htmlStr)              //分离后的文本数据和表格数据
    var txt=txtAndTables.txt;
    var tables=txtAndTables.tables;
    
    var markText=splitHtml(txt)
    markText=mergeTables(markText,tables);
    return markText;
}

/**
 * 处理表格，将所有的表格数据放置到指定数组中临时存储
 * @param   tables      用来临时存储表格数据的数组
 * @param   htmlStr     需要处理的html字符串
 * @returns 返回一个对象，对象具有两个属性。txt属性是一个字符串包含文本；tables属性是一个数组，包含查找到的表格数据。
 */
function splitTables(htmlStr)
{
    var reg=/<table[^>]*?>|<\/table[^>]*?>/g;
    var tages=[]; 
    var result;
    while((result=reg.exec(htmlStr))!=null)                //记录查找到的表格标签的内容、位置等信息
    {
        tages.push(result)
    }

    var txt="";
                    
    var tables=[];                //保存截取到的表格内容

    var startIndex=0;            //表格前置标签的位置
    var endIndex=0;              //表格后置标签之后的位置

    var tagIndex=0;
    var tagArr=[];          
    while(tagIndex<tages.length)
    {
        if(tages[tagIndex][0].match(/^<table/))        //前置标签
        {
            if(tagArr.length==0)
            {
                txt+=htmlStr.substring(startIndex,tages[tagIndex].index);   //追加限定区域中的文本
                startIndex=tages[tagIndex].index;
            }
            tagArr.push(1)
        }
        else                                        //后置标签
        {
            tagArr.pop();
            if(tagArr.length==0)
            {
                endIndex=tages[tagIndex].index+tages[tagIndex][0].length;
                txt+="<p>@@table@@</p>";
                tables.push(htmlStr.substring(startIndex,endIndex));
                startIndex=endIndex;
            }
        }
        tagIndex++;
    }
    txt+=htmlStr.substr(startIndex);
    // console.log("splitTables:===========================");
    // console.log(txt);
    return {txt:txt,tables:tables}
}

/**
 * 将文本和表格数据合并
 * @param txt       需要合并的文本
 * @param tables    用来合并的表格数据数组
 */
function mergeTables(txt,tables)
{
    var i=0;
    txt=txt.replace(/@@table@@/g,function(s){
        return "> "+tables[i++];
    });
    // console.log("mergeTables:======================")
    // console.log(txt);
    return txt;
}

/**
 * 拆分html数据
 * @description 将html文本按照段落拆分,并将html文本中所有支持的标签转为标记文本
 * @returns     解析好的标记文本
 */
function splitHtml(html)
{
    var htmlArr=html.match(/<p>.*?<\/p>|<ol>.*?<\/ol>|<ul>.*?<\/ul>|<h\d>.*?<\/h\d>/g)
    var line;
    var markText=""
    var tableIndex=0;
    for(var i=0;i<htmlArr.length;i++)
    {
        line=htmlArr[i];
        if(line.match(/^<p>/))                                              //普通段落
        {
            line=line.replace(/^<p>/,"").replace(/<\/p>$/,"")
        }
        else if(line.match(/^<ol>/))                                        //有序列表
        {
            line=line.replace(/^<ol>/,"").replace(/<\/ol>$/,"")
            line=line.replace(/<\/li>/g,"\n").replace(/<li>/g,"+ ")
            line=line.replace(/\n$/,"")
        }
        else if(line.match(/^<ul>/))                                        //无需编号
        {
            line=line.replace(/^<ul>/,"").replace(/<\/ul>$/,"")
            line=line.replace(/<\/li>/g,"\n").replace(/<li>/g,"* ")
            line=line.replace(/\n$/,"")
        }
        else if(line.match(/^<h1>/))                                        //标题1
        {
            line=line.replace(/^<h1>/,"").replace(/<\/h1>$/,"")
            line="# "+line;
        }
        else if(line.match(/^<h2>/))                                        //标题2
        {
            line=line.replace(/^<h2>/,"").replace(/<\/h2>$/,"")
            line="## "+line;
        }
        else if(line.match(/^<h3>/))                                        //标题3
        {
            line=line.replace(/^<h3>/,"").replace(/<\/h3>$/,"")
            line="### "+line;
        }
        else if(line.match(/^<h4>/))                                        //标题4
        {
            line=line.replace(/^<h4>/,"").replace(/<\/h4>$/,"")
            line="#### "+line;
        }
        else if(line.match(/^<h5>/))                                        //标题5
        {
            line=line.replace(/^<h5>/,"").replace(/<\/h5>$/,"")
            line="##### "+line;
        }
        else if(line.match(/^<h6>/))                                        //标题6
        {
            line=line.replace(/^<h6>/,"").replace(/<\/h6>$/,"")
            line="###### "+line;
        }

        line=parseImg(line);
        line=parseLink(line);
        line=parseBoldOrItalic(line);
        line=parseUnderline(line);
        line=parseSupAndSub(line);
        line=parseBracket(line);
        markText+=line+"\n";
    }
    return markText;
}

/**
 * 将html的Img标签转为标记文本模式
 * @param   line    html文本
 * @returns 标记文本
 */
function parseImg(line)
{
    line=line.replace(/<img [\s\S]*?src="([\s\S]*?\.png|[\s\S]*?\.png)"\s?\/>/g,function(s){
        var srcArr=arguments[1].split(/[\/\\]/)
        var src=srcArr[srcArr.length-1]
        return "{{"+imgDir+""+src+"}}"
    });
    return line;
}

/**
 * 将html的a标签转为标记文本模式
 * @param   line    html文本
 * @returns 标记文本
 */
function parseLink(line)
{
    line=line.replace(/<a [\s\S]*?href="([\s\S]*?)" [\s\S]*?>([\s\S]*?)<\/a>/g,function(s){
        return "["+arguments[2]+"]("+arguments[1]+")"
    });
    return line;
}

/**
 * 斜体和粗体字的处理
 */
function parseBoldOrItalic(line)
{
    line=line.replace(/<strong>\s*?<em>/g,"***").replace(/<\/em>\s*?<\/strong>/g,"***");
    line=line.replace(/<strong>/g,"**").replace(/<\/strong>/g,"**");
    line=line.replace(/<em>/g,"*").replace(/<\/em>/g,"*");
    return line;
}

/**
 * 下滑线的处理
 */
function parseUnderline(line)
{
    line=line.replace(/<u>/g,"__").replace(/<\/u>/g,"__");
    return line;
}

/**
 * 处理上下标
 */
function parseSupAndSub(line)
{
    line=line.replace(/<sup>/g,"``").replace(/<\/sup>/g,"``");
    line=line.replace(/<sub>/g,"..").replace(/<\/sub>/g,"..");
    return line;
}

/**
 * 处理尖括号
 */
function parseBracket(line)
{
    line=line.replace(/&lt;/g,"<").replace(/&gt;/g,">");
    return line;
}



