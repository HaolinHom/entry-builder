const path = require('path');
const regexp = require('./regexp');
const CONFIG = require('../dict/common/CONFIG');

// 当前执行命令的路径
const currentPath = process.cwd();
// 当前执行命令的目录名称
const currentDirName = path.basename(currentPath);
// 当前执行命令的配置文件路径
const configFilePath = path.join(currentPath, CONFIG.FILE);
// 当前执行命令的.gitIgnore路径
const gitIgnorePath = path.join(currentPath, CONFIG.GIT_IGNORE);
//
const packageJsonPath = path.join(currentPath, CONFIG.PACKAGE_JSON);

function removeExtname(argPath) {
  let  extname = path.extname(argPath);
  if (extname.length) {
    argPath = argPath.slice(0, -(extname.length));
  }
  return argPath;
}

function getPath(argPath, options = {}) {
  const { noExtname } = options;

  if (noExtname) {
    argPath = removeExtname(argPath);
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
  packageJsonPath,
  removeExtname,
  getPath,
  getRelative,
};

module.exports = paths;