/***************************************************/
//名称：txt2html
//程序用途:
//  将ppt标记语言文本转为reveal.js 使用的html
//用法：
//  node html2txt.js xxx.html [xxx.txt]
/***************************************************/
var fs=require("fs");
var argv=process.argv;

//获取命令行参数
var inputFileName=(argv[2]);            //输入文件名
var outputFileName=(argv[3]);           //输出文件名

//设定基本的css类名
var alignCenterClass="alignCenter"      //居中对齐
var alignRightClass="alignRight"        //居右对齐
var contentClass="content"              //段落文本，有缩进设置
var listContentClass="list-content"     //段落文字，无缩进设置

// //判断文件类型
// if(inputFileName==undefined||!inputFileName.match(/.txt$/))
// {
//     console.log("文件类型错误，请确认文件类型是否正确！")
//     return;
// }

// try
// {
//     var txtData=fs.readFileSync(inputFileName).toString();
//     var html=generateHtml(txtData);
//     console.log(html);
// }
// catch(e)
// {
//     console.log("打开文件出错!");
//     console.log(e);
// }

/**
 * 输出html代码
 */
function generateHtml(txt)
{
    var htmls=[];
    htmls.push("<section>");

    var txtArr=txt.split("\n");
    var line=""
    var listFlag="";
    var classArr;                      //需要添加到标签中的类,比如alignCenter等
    for(var i=0;i<txtArr.length;i++)
    {
        classArr=null;
        line=trim(txtArr[i]);
        if(line=="//")                  //跳过注释行
        {
            continue;
        }
        else if(line.match(/^\(\(.*?\)\)$/))        //幻灯片标题
        {
            line=line.replace(/^\(\(/,"").replace(/\)\)$/,"")
            insertSectionTitle(htmls,line)
        }
        else if(line=="---")
        {
            htmls.push("</section>");
            htmls.push("<section>")
            listFlag="";
        }
        else
        {
            if(line.match(/^> /))      //无需转义的行
            {
                line=line.replace(/^> /,"")
            }
            else
            {
                line=line.replace(/</g,"&lt;").replace(/>/g,"&gt;")
            }


            if(line.match(/^\[\[ /))            //存入一个交互类
            {
                classArr=["fragment"];
                line=line.replace(/^\[\[ /,'');
            }
        

            //列表的处理
            if(line.match(/^\* /))
            {
                if(listFlag=="ul")
                {
                    line=wrapByTag("li",line.replace(/^\* /,""),classArr);
                }
                else if(listFlag=="ol")
                {
                    htmls.push("</ol>")
                    htmls.push("<ul>")
                }
                else
                {
                    htmls.push("<ul>")
                    line=wrapByTag("li",line.replace(/^\* /,""),classArr);
                }
                listFlag="ul";
            }
            else if(line.match(/^\+ /))
            {
                if(listFlag=="ol")
                {
                    line=wrapByTag("li",line.replace(/^\+ /,""),classArr);
                }
                else if(listFlag=="ul")
                {
                    htmls.push("</ul>")
                    htmls.push("<ol>")
                }
                else
                {
                    htmls.push("<ol>")
                    line=wrapByTag("li",line.replace(/^\+ /,""),classArr);
                }
                listFlag="ol"
            }
            else
            {
                if(listFlag!="")
                {
                    htmls.push("</"+listFlag+">")
                    listFlag="";
                }
                //标题的处理
                var result;
                if((result=line.match(/^(#+) /))!=null)
                {
                    line=wrapByTag("h"+result[1].length,line.substr(result[1].length+1),classArr)
                }
                else if((result=line.match(/^(#+)C /))!=null)
                {
                    classArr==null?classArr=[alignCenterClass]:classArr.push(alignCenterClass);
                    line=wrapByTag("h"+result[1].length,line.substr(result[1].length+2),classArr)
                }
                else if((result=line.match(/^(#+)R /))!=null)
                {
                    classArr==null?classArr=[alignRightClass]:classArr.push(alignRightClass);
                    line=wrapByTag("h"+result[1].length,line.substr(result[1].length+2),classArr)
                }

                //正文的处理
                else if(line.match(/\[C /))
                {
                    classArr==null?classArr=[alignCenterClass]:classArr.push(alignCenterClass);
                    classArr.push(contentClass)
                    line=wrapByTag("p",line.substr(3),classArr);
                }
                else if(line.match(/\[L /))                 //使用list-content样式不缩进
                {
                    classArr==null?classArr=[listContentClass]:classArr.push(listContentClass)
                    line=wrapByTag("p",line.substr(3),classArr);
                }
                else if(line.match(/\[R /))
                {
                    classArr==null?classArr=[alignRightClass]:classArr.push(alignRightClass)
                    classArr.push(contentClass)
                    line=wrapByTag("p",line.substr(3),classArr);
                }
                else
                {
                    classArr==null?classArr=[contentClass]:classArr.push(contentClass)
                    line=wrapByTag("p",line,classArr);
                }


            }
            line=parseImg(line);
            line=parseBoldAndItalic(line);
            line=parseLink(line);
            line=parseSupAndSub(line);
            line=parseUnderline(line);
            line=parseFragment(line);               //处理段中间的隐藏
            htmls.push(line);
        }

    }

    if(htmls[htmls.length-1]!="</section>")
    {
        htmls.push("</section>")
    }

    return htmls.join("\n");
}


module.exports=generateHtml;

/**
 * 去掉字符串两端的空格字符
 */
function trim(str)
{
    str=str.replace(/^\s*/,"").replace(/\s*$/,"")
    return str;
}

/**
 * 找到最近的section标签，并插入ppt的标题
 */
function insertSectionTitle(arr,line)
{
    for(var i=arr.length-1;i>=0;i--)
    {
        if(arr[i].match(/^<section/))
        {
            arr[i]="<section data-menu-title=\""+line+"\">"
        }
    }
}

/**
 * 使用指定的html标签将文本包装为html字符串
 */
function wrapByTag(tag,txt,attr)
{
    var str="<"+tag;
    if(attr!=null)
    {
        str+=" class=\""+attr.join(" ")+"\""
    }
    str+=">"
    str+=txt;
    str+="</"+tag+">";
    return str;
}

/**
 * 解析图片
 */
function parseImg(line)
{
    line=line.replace(/\{\{(.*?)\}\}/g,"<img src=\"$1\"/>");
    return line;
}

/**
 * 解析粗体和斜体
 */
function parseBoldAndItalic(line)
{
    line=line.replace(/\*\*\*(.*?)\*\*\*/g,"<strong><em>$1</em></strong>");
    line=line.replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>");
    line=line.replace(/\*(.*?)\*/g,"<em>$1</em>");
    return line;
}

/**
 * 处理链接
 */
function parseLink(line)
{
    line=line.replace(/\[(.*?)\]\((.*?)\)/,"<a href=\"$2\">$1</a>")
    return line;
}

/**
 * 处理上下标
 */
function parseSupAndSub(line)
{
    line=line.replace(/``(.*?)``/,"<sup>$1</sup>").replace(/\.\.(.*?)\.\./,"<sub>$1</sub>");
    return line;
}

/**
 * 处理下划线
 */
function parseUnderline(line)
{
    line=line.replace(/__(.*?)__/,"<u>$1</u>");
    return line;
}

function parseFragment(line)
{
    line=line.replace(/\[\[(.*?)\]\]/,"<span class=\"fragment\">$1</span>")
    return line;
}