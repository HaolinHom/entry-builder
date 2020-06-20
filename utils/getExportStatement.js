const path = require('path');
const paths = require('./paths');

function getExportStatement(from, toList) {
  let result = [];

  let tempPath, resource;
  for (let i = 0; i < toList.length; i++) {
    if (toList[i].length > 0) {
      tempPath = path.relative(from, toList[i]);
      resource = paths.getPath(tempPath, { noExtname: true });
      result.push(
        `export { default as ${path.basename(paths.removeExtname(tempPath))} } from '${resource}';`
      );
    }
  }

  return result;
}

module.exports = getExportStatement;