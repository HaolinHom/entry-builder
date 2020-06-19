const path = require('path');
const fs = require('fs');
const regexp = require('./regexp');

function getDirResource(dirPath) {
  let fileList = fs.readdirSync(dirPath);

  const indexJs = fileList.find(filename => regexp.indexJs.test(filename));
  if (indexJs) {
    return dirPath;
  }

  fileList = fileList.filter(filename => !regexp.js.test(filename));

  if (fileList.length > 0) {
    return fileList.map(filename => getFileResource(path.resolve(dirPath, filename))).join('|');
  }

  return '';
}

function getFileResource(filePath) {
  const stat = fs.statSync(filePath);

  if (stat.isFile()) {
    return filePath;
  } else if (stat.isDirectory()) {
    return getDirResource(filePath);
  }

  return null;
}

module.exports = getFileResource;