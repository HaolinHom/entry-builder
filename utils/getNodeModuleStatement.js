const path = require('path');
const paths = require('./paths');

function getNodeModuleStatement(from, toList) {
  let requires = [];
  let modules = [];

  let tempPath, resource, tempName;
  for (let i = 0; i < toList.length; i++) {
    if (toList[i].length > 0) {
      tempPath = path.relative(from, toList[i]);
      resource = paths.getPath(tempPath, { noExtname: true });
      tempName = path.basename(paths.removeExtname(tempPath));
      requires.push(`const ${tempName} = require('${resource}');`);
      modules.push(tempName);
    }
  }

  if (modules.length === 0) {
    return '';
  }

  return requires.join('\r\n')
    +
`

module.exports = {
  ${modules.join(`,\r\n\t`)},
};`;
}


module.exports = getNodeModuleStatement;