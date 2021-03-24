const fs = require('fs');
const path = require('path');
const std = require('std-terminal-logger');
const paths = require('../utils/paths');
const mergeOptionToConfig = require('../utils/mergeOptionToConfig');
const validateConfig = require('../utils/validateConfig');
const configAdapter = require('../utils/configAdapter');
const getResource = require('../utils/getResource');
const regexp = require('../utils/regexp');
const getEsModuleStatement = require('../utils/getEsModuleStatement');
const getCommonjsStatement = require('../utils/getCommonjsStatement');
const createCommand = require('./create');
const BUILD = require('../dict/commander/BUILD');
const CONFIG = require('../dict/common/CONFIG');

async function buildCommand(options) {
  let isCfgExist = fs.existsSync(paths.configFilePath);

  const isHadOptions = !isCfgExist && options.input && options.output && options.format;

  let config;
  if (isCfgExist || isHadOptions) {
    config = isCfgExist ? require(paths.configFilePath) : require('../dict/common/defaultConfig');
    config = mergeOptionToConfig(options, config);

    if (!validateConfig(config)) {
      return;
    }
    config = configAdapter(config);
  } else {
    const canChooseCreateFile = true;
    config = await createCommand(options, canChooseCreateFile);
    config = [config];
  }

  config.forEach((cfg) => {
    const entryDirPath = path.resolve(paths.currentPath, cfg.entry.path);
    const outputPath = path.resolve(paths.currentPath, cfg.output.path);

    const isEntryDirExist = fs.existsSync(entryDirPath);
    if (!isEntryDirExist) {
      return std.error(BUILD.ERROR.ENTRY_DIR_NOT_EXIST);
    }

    let exportStatement = [];

    let getExportStatement = cfg.moduleType === CONFIG.ES_MODULE ? getEsModuleStatement : getCommonjsStatement;

    try {
      exportStatement = getExportStatement(
        outputPath,
        getResource(entryDirPath, { ignorePath: cfg.ignorePath, ignoreFile: cfg.ignoreFile })
      );
    } catch (e) {
      return std.error(e);
    }
    if (exportStatement.length === '') {
      return std.error(BUILD.ERROR.NO_NEED_BUILD);
    }

    const filename = regexp.extname.test(path.extname(cfg.output.filename)) ? cfg.output.filename : `${cfg.output.filename}.js`;

    const outputFilePath = path.resolve(outputPath, filename);

    fs.writeFileSync(outputFilePath, exportStatement, { encoding: 'utf8' });
  });

  std.success(BUILD.SUCCESS.FINISH_BUILD);
}

module.exports = buildCommand;
