const path = require('path');
const fs = require('fs');
const regexp = require('./regexp');
const paths = require('./paths');

function getDirResource(dirPath, options) {
  if (
    options.ignorePath.length > 0
    &&
    options.ignorePath.includes(paths.getRelative(options.basePath, dirPath))
  ) {
    return '';
  }

  let fileList = fs.readdirSync(dirPath);

  const indexJs = fileList.find(filename => regexp.indexJs.test(filename));
  if (indexJs) {
    return dirPath;
  }

  fileList = fileList.filter(filename => !regexp.js.test(filename));

  if (fileList.length > 0) {
    return fileList.map(filename => {
      if (options.ignoreFile.includes(filename)) {
        return '';
      }
      return getFileResource(path.resolve(dirPath, filename), options);
    }).join('|');
  }

  return '';
}

function getFileResource(filePath, options) {
  if (
    options.ignorePath.length > 0
    &&
    options.ignorePath.includes(paths.getRelative(options.basePath, filePath))
  ) {
    return '';
  }
  const stat = fs.statSync(filePath);

  if (stat.isFile()) {
    return options.onlyDirectory ? '' : filePath;
  } else if (stat.isDirectory()) {
    return options.onlyFile ? '' : getDirResource(filePath, options);
  }

  return null;
}

/**
 * @param basePath {string}
 * @param options {object?}
 * @param options.onlyFile {boolean?}
 * @param options.onlyDirectory {boolean?}
 * @param options.ignoreFile {Array?}
 * @param options.ignorePath {Array?}
 * */
function getResource(basePath, options = {}) {
  if (options.onlyFile && options.onlyDirectory) {
    options = {};
  }
  if (!Array.isArray(options.ignoreFile)) {
    options.ignoreFile = [];
  }
  if (!Array.isArray(options.ignorePath)) {
    options.ignorePath = [];
  }
  options.basePath = basePath;

  const fileList = fs.readdirSync(basePath);
  if (fileList.length === 0) {
    throw `There are no such file in ${basePath}!`;
  }
  return fileList
    .map((filename) => {
      if (options.ignoreFile.length > 0 && options.ignoreFile.includes(filename)) {
        return '';
      }
      return getFileResource(path.resolve(basePath, filename), options);
    })
    .join('|')
    .split('|')
    .filter(item => item.length > 0);
}

module.exports = getResource;