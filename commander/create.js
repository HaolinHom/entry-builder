const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');
const std = require('std-terminal-logger');
const paths = require('../utils/paths');
const selectPath = require('../utils/selectPath');
const CONFIG = require('../dict/common/CONFIG');
const CREATE = require('../dict/commander/CREATE');
const getResource = require('../utils/getResource');

async function createCommand(options, canChooseCreateFile) {
  const isCfgExist = fs.existsSync(paths.configFilePath);
  if (isCfgExist) {
    std.warn(CREATE.WARN.CONFIG_FILE_EXIST);

    const { noRewrite } = await prompt({
      name: 'noRewrite',
      type: 'toggle',
      message: CREATE.PROMPT.REWRITE_CONFIG_FILE,
      initial: true,
      enabled: 'NO',
      disabled: 'YES',
    });
    if (noRewrite) {
      return;
    }
  }

  std.info(CREATE.INFO.RUNNING);

  // config.entry
  const entryPath = options.input || await selectPath(
    paths.currentPath,
    {
      message: CREATE.PROMPT.SELECT_ENTRY_PATH,
      fileType: 'DIR',
      noPrefixDot: true,
      root: true,
    }
  );

  const optOutputParse = path.parse(options.output || '');
  const optOutputDir = options.output ? optOutputParse.dir || './' : null;
  const optOutputBase = optOutputParse.base ? { outputFilename: optOutputParse.base } : null;
  // config.output
  const outputPath = optOutputDir || await selectPath(
    paths.currentPath,
    {
      message: CREATE.PROMPT.SELECT_OUTPUT_PATH,
      fileType: 'DIR',
      noPrefixDot: true,
      root: true,
    }
  );
  const { outputFilename } = optOutputBase || await prompt({
    type: 'input',
    name: 'outputFilename',
    initial: 'index.js',
    message: CREATE.PROMPT.INPUT_OUTPUT_FILENAME,
  });

  const optFormat = options.format && [CONFIG.ES_MODULE, CONFIG.COMMONJS].includes(options.format) ?
    { moduleType: options.format } : null;
  // config.moduleType
  const { moduleType } = optFormat || await prompt({
    name: 'moduleType',
    type: 'select',
    message: CREATE.PROMPT.SELECT_MODULE_TYPE,
    choices: [CONFIG.ES_MODULE, CONFIG.COMMONJS],
    initial: CONFIG.ES_MODULE,
  });

  const config = {
    entry: {
      path: paths.getRelative(paths.currentPath, entryPath),
    },
    output: {
      path: paths.getRelative(paths.currentPath, outputPath),
      filename: outputFilename,
    },
    moduleType: moduleType,
    ignorePath: [].concat(CONFIG.DEFAULT_IGNORE_PATH),
  };

  // config.ignorePath
  if (paths.currentPath === path.resolve(paths.currentPath, config.entry.path)) {
    try {
      const currentResource = getResource(
        paths.currentPath,
        { onlyFile: true, ignoreFile: CONFIG.DEFAULT_IGNORE_FILE },
      );
      currentResource.forEach((resourcePath) => {
        config.ignorePath.push(paths.getRelative(paths.currentPath, resourcePath));
      });
    } catch (e) {
      return std.error(e);
    }
  }

  std.label('config')(config);

  let needCreateConfig = true;

  if (canChooseCreateFile) {
    const { needCreate } = await prompt({
      name: 'needCreate',
      type: 'toggle',
      message: CREATE.PROMPT.TOGGLE_CREATE_CONFIG_FILE,
      initial: true,
      enabled: 'YES',
      disabled: 'NO',
    });
    needCreateConfig = needCreate;
  }

  if (needCreateConfig) {
    const packageJson = require('../package.json');

    fs.writeFileSync(
      path.join(paths.currentPath, CONFIG.FILE),
      `module.exports = ${JSON.stringify(config, null, 2)};`,
      { encoding: 'utf8' }
    );

    std.success(CREATE.SUCCESS.FINISH_CREATE);
  }

  return config;
}

module.exports = createCommand;