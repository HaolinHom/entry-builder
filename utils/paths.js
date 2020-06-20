const path = require('path');
const regexp = require('./regexp');

// 当前执行命令的路径
const currentPath = process.cwd();
// 当前执行命令的目录名称
const currentDirName = path.basename(currentPath);
// 当前执行命令的配置文件路径
const configFilePath = path.join(currentPath, 'entry-builder-config.js');
// 当前执行命令的.gitIgnore路径
const gitIgnorePath = path.join(currentPath, '.gitignore');

function getPath(argPath, options = {}) {
  const { noExtname } = options;

  if (noExtname) {
    let  extname = path.extname(argPath);
    if (extname.length) {
      argPath = argPath.slice(0, -(extname.length));
    }
  }

  let tagPath = argPath.split(path.sep).join('/');
  if (regexp.noPrefixDot.test(tagPath)) {
    tagPath = `./${tagPath}`;
  }

  return tagPath;
}

function getRelative(form, to, options = {}) {
  const relativePath = path.relative(form, to);
  if (relativePath === '') {
    return './';
  }
  return getPath(relativePath, options);
}

const paths = {
  currentPath,
  currentDirName,
  configFilePath,
  gitIgnorePath,
  getPath,
  getRelative,
};

module.exports = paths;