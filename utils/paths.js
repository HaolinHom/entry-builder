const path = require('path');
const regexp = require('./regexp');
const CONFIG = require('../dict/common/CONFIG');

// Path of currently executing command
const currentPath = process.cwd();
// The name of the directory currently executing the command
const currentDirName = path.basename(currentPath);
// The path of the configuration file of the currently executing command
const configFilePath = path.join(currentPath, CONFIG.FILE);
// The .gitignore path of the currently executing command
const gitIgnorePath = path.join(currentPath, CONFIG.GIT_IGNORE);
// The package.json path of the currently executing command
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