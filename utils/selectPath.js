const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');
const regexp = require('../utils/regexp');

/**
 * @param basePath {string}
 * @param options {object?}
 * @param options.message {string?}
 * @param options.fileType {string?} ('ALL', 'DIR')
 * @param options.noPrefixDot {boolean?}
 * @param options.root {boolean?}
 * */
async function selectPath(basePath, options = {}) {
  const { message, fileType = 'ALL', noPrefixDot, root } = options;

  let fileList = fs.readdirSync(basePath);

  if (fileType === 'DIR') {
    fileList = fileList.filter((filename) => {
      const _path = path.join(basePath, filename);
      const _stat = fs.statSync(_path);
      return _stat.isDirectory();
    });
  }

  if (noPrefixDot) {
    fileList = fileList.filter(filename => regexp.noPrefixDot.test(filename));
  }

  if (root) {
    fileList.unshift('./');
  }

  const { selectPath } = await prompt({
    type: 'select',
    name: 'selectPath',
    message: message || 'Please select the path:',
    choices: fileList,
  });

  if (selectPath === './') {
    return basePath;
  }

  const tagPath = path.resolve(basePath, selectPath);
  const tagStat = fs.statSync(tagPath);

  if (tagStat.isDirectory()) {
    const { isContinue } = await prompt({
      type: 'toggle',
      name: 'isContinue',
      message: 'Continue to Select?',
      initial: 'YES',
      enabled: 'YES',
      disabled: 'NO',
    });
    if (isContinue) {
      delete options.root;
      return await selectModule(tagPath, options);
    }
  }

  return tagPath;
}

module.exports = selectPath;
