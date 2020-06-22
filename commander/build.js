const fs = require('fs');
const path = require('path');
const std = require('../utils/std');
const paths = require('../utils/paths');
const validateConfig = require('../utils/validateConfig');
const configAdapter = require('../utils/configAdapter');
const getFileResource = require('../utils/getFileResource');
const getExportStatement = require('../utils/getExportStatement');
const createCommand = require('./create');
const BUILD = require('../dict/commander/BUILD');

async function buildCommand() {
  const isCfgExist = fs.existsSync(paths.configFilePath);

  let cfg;
  if (isCfgExist) {
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
    return std.error(BUILD.ERROR.ENTRY_DIR_NOT_EXIST);
  }

  const fileList = fs.readdirSync(entryDirPath);
  if (fileList.length === 0) {
    return std.error(BUILD.ERROR.NO_FILE_IN_ENTRY_PATH);
  }

  const exportStatement = getExportStatement(
    outputPath,
    fileList
      .map(filename => getFileResource(path.resolve(entryDirPath, filename), filename))
      .join('|')
      .split('|')
  );
  if (exportStatement.length === 0) {
    return std.error(BUILD.ERROR.NO_NEED_BUILD);
  }

  const outputFilePath = path.resolve(outputPath, `${cfg.output.filename}.js`);

  fs.writeFileSync(outputFilePath, exportStatement.join('\r\n\r\n'), { encoding: 'utf8' });

  std.success(BUILD.SUCCESS.FINISH_BUILD);
}

module.exports = buildCommand;
