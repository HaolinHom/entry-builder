const path = require('path');

// 当前执行命令的路径
const currentPath = process.cwd();
// 当前执行命令的目录名称
const currentDirName = path.basename(currentPath);
// 当前执行命令的配置文件路径
const configFilePath = path.join(currentPath, 'entry-builder-config.js');

const paths = {
  currentPath,
  currentDirName,
  configFilePath,
};

module.exports = paths;