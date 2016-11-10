var program = require('commander');

program
    .version('0.0.1')
    .option('-g, --generator', '生成课件')
    .option('-s, --server', '启动server......')
    .option('-c, --clean', '清空output目录')
    .parse(process.argv);

if (program.generator) {
    console.log('  - 生成课件......');
}
if (program.server) {
    console.log('  - 启动服务器......');
}
if (program.clean) {
    console.log('  - 清空目录');
}