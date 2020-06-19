const path = require('path');

function getExportStatement(from, toList) {
  let result = [];

  let temp, extname, resource;
  for (let i = 0; i < toList.length; i++) {
    if (toList[i].length > 0) {
      temp = path.relative(from, toList[i]);
      extname = path.extname(temp);
      if (extname.length) {
        temp = temp.slice(0, -(extname.length));
      }
      resource = temp.split(path.sep).join('/');
      if (/^[^.]/.test(resource)) {
        resource = `./${resource}`;
      }
      result.push(
        `import { default as ${path.basename(temp)} } from '${resource}';`
      );
    }
  }

  return result;
}

module.exports = getExportStatement;