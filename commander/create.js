const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');
const std = require('std-terminal-logger');
const paths = require('../utils/paths');
const selectPath = require('../utils/selectPath');
const CONFIG = require('../dict/common/CONFIG');
const CREATE = require('../dict/commander/CREATE');
const getResource = require('../utils/getResource');

async function createCommand(commander) {
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
  const entryPath = await selectPath(
    paths.currentPath,
    {
      message: CREATE.PROMPT.SELECT_ENTRY_PATH,
      fileType: 'DIR',
      noPrefixDot: true,
      root: true,
    }
  );

  // config.output
  const outputPath = await selectPath(
    paths.currentPath,
    {
      message: CREATE.PROMPT.SELECT_OUTPUT_PATH,
      fileType: 'DIR',
      noPrefixDot: true,
      root: true,
    }
  );
  const { outputFilename } = await prompt({
    type: 'input',
    name: 'outputFilename',
    initial: 'index',
    message: CREATE.PROMPT.INPUT_OUTPUT_FILENAME,
  });

  // config.moduleType
  const { moduleType } = await prompt({
    name: 'moduleType',
    type: 'select',
    message: CREATE.PROMPT.SELECT_MODULE_TYPE,
    choices: [CONFIG.ES_MODULE, CONFIG.NODE_MODULE],
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

  std.log('config: ', config);

  let needCreateConfig = true;

  if (!commander) {
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

    const statement =
`/**
 * ${packageJson.name}
 * Description: ${packageJson.description}
 * Homepage: ${packageJson.homepage}
 * */
module.exports = {
  entry: {
    path: '${config.entry.path}',
  },
  output: {
    path: '${config.output.path}',
    filename: '${config.output.filename}',
  },
  moduleType: '${config.moduleType}',
  ignorePath: [
${config.ignorePath.map(item => 
`    '${item}',`
).join('\r\n')}
  ],
};`;

    fs.writeFileSync(path.join(paths.currentPath, CONFIG.FILE), statement, { encoding: 'utf8' });

    const isIgnoreExist = fs.existsSync(paths.gitIgnorePath);
    if (isIgnoreExist) {
      const { addIgnore } = await prompt({
        name: 'addIgnore',
        type: 'toggle',
        message: CREATE.PROMPT.TOGGLE_ADD_IN_GIT_IGNORE,
        initial: false,
        enabled: 'YES',
        disabled: 'NO',
      });
      if (addIgnore) {
        let ignoreContent = fs.readFileSync(paths.gitIgnorePath, { encoding: 'utf8' });
        ignoreContent +=
`
# ${packageJson.name}
${CONFIG.FILE}
`;
        fs.writeFileSync(paths.gitIgnorePath, ignoreContent, { encoding: 'utf8' });
      }
    }

    std.success(CREATE.SUCCESS.FINISH_CREATE);
  }

  return config;
}

module.exports = createCommand;