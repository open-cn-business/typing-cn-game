// 给定一个文件目录，遍历所有的json后缀的文件，找出name的key，然后输出到一个文件中
const fs = require('fs');
const path = require('path');

// 读取命令行参数，获取输入的目录
const dir = process.argv[2];
// 读取目录下的所有文件
const files = fs.readdirSync(dir);
// 用于存储所有的name
const names = [];
// 遍历所有的文件
files.forEach(file => {
    // 获取文件的绝对路径
    const filePath = path.join(dir, file);
    // 获取文件名
    const fileName = path.basename(filePath);
    // 判断文件是否是json文件
    if (path.extname(fileName) === '.json') {
        // 读取json文件
        fs.readdirSync(filePath, 'utf8', (err, data) => {
            if (err) {
                console.log(err);
            }
            // 将json文件转换为对象
            const obj = JSON.parse(data);
            // 将name存储到names中
            names.push(obj.name);
        });
    }
});
// 将names转换为字符串
const namesStr = names.join('x');
// 将namesStr写入到文件中
fs.writeFileSync('names.txt', namesStr);
