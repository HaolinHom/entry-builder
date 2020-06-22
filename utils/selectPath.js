const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');
const regexp = require('../utils/regexp');


const DICT = {
  ROOT: './',
  CONFIRM: '[Confirm]',
  RETURN: '[Return]',
  ALL: 'ALL',
  DIR: 'DIR',
};

/**
 * @param basePath {string}
 * @param options {object?}
 * @param options.message {string?}
 * @param options.fileType {string?} ('ALL', 'DIR')
 * @param options.noPrefixDot {boolean?}
 * @param options.root {boolean?}
 * @param options.history {Array?}
 * */
async function selectPath(basePath, options = {}) {
  const { message, fileType = DICT.ALL, noPrefixDot, root, history = [] } = options;

  let fileList = fs.readdirSync(basePath);

  if (fileType === DICT.DIR) {
    fileList = fileList.filter((filename) => {
      const _path = path.join(basePath, filename);
      const _stat = fs.statSync(_path);
      return _stat.isDirectory();
    });
  }

  if (noPrefixDot) {
    fileList = fileList.filter(filename => regexp.noPrefixDot.test(filename));
  }

  if (root && (!history || Array.isArray(history) && history.length === 0)) {
    fileList.unshift(DICT.ROOT);
  }

  if (Array.isArray(history) && history.length > 0) {
    fileList.unshift(DICT.CONFIRM);
    fileList.push(DICT.RETURN);
  }

  const { selected } = await prompt({
    type: 'select',
    name: 'selected',
    message: message || 'Please select the path:',
    choices: fileList,
  });

  if (selected === DICT.ROOT || selected === DICT.CONFIRM) {
    return basePath;
  } else if (selected === DICT.RETURN) {
    const popped = options.history.pop();
    return await selectPath(popped, options);
  }

  const tagPath = path.resolve(basePath, selected);
  const tagStat = fs.statSync(tagPath);

  if (tagStat.isDirectory()) {
    if (!Array.isArray(options.history)) {
      options.history = [];
    }
    options.history.push(basePath);
    return await selectPath(tagPath, options);
  }

  return tagPath;
}

module.exports = selectPath;
