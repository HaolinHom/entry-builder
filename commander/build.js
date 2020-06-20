const fs = require('fs');
const path = require('path');
const std = require('../utils/std');
const paths = require('../utils/paths');
const validateConfig = require('../utils/validateConfig');
const configAdapter = require('../utils/configAdapter');
const getFileResource = require('../utils/getFileResource');
const getExportStatement = require('../utils/getExportStatement');
const createCommand = require('./create');

async function buildCommand() {
  // 运行目录下是否有`entry-builder-config.js`
  const isCfgExist = fs.existsSync(paths.configFilePath);

  let cfg;
  if (isCfgExist) {
    // 读取配置文件
    cfg = require(paths.configFilePath);
    if (!validateConfig(cfg)) {
      return;
    }
    cfg = configAdapter(cfg);
  } else {
    cfg = await createCommand();
  }
  // std.log('full config: ', cfg);

  const outputPath = path.resolve(paths.currentPath, cfg.output.path);
  const entryDirPath = path.resolve(paths.currentPath, cfg.entry.path);
  const isEntryDirExist = fs.existsSync(entryDirPath);

  if (!isEntryDirExist) {
    return std.error('Config\'s entry directory path doesn\'t exist!');
  }

  const fileList = fs.readdirSync(entryDirPath);
  if (fileList.length === 0) {
    return std.warn(`There are no such file in ${entryDirPath}!`);
  }

  const exportStatement = getExportStatement(
    outputPath,
    fileList
      .map(filename => getFileResource(path.resolve(entryDirPath, filename), filename))
      .join('|')
      .split('|')
  );
  if (exportStatement.length === 0) {
    return std.warn(`There are no need build entry file.`);
  }

  const outputFilePath = path.resolve(outputPath, `${cfg.output.filename}.js`);

  fs.writeFileSync(outputFilePath, exportStatement.join('\r\n\r\n'), { encoding: 'utf8' });

  std.success('Entry file is finish building.');
}

module.exports = buildCommand;
