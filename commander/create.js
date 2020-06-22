const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');
const std = require('../utils/std');
const paths = require('../utils/paths');
const selectPath = require('../utils/selectPath');
const CONFIG = require('../dict/common/CONFIG');
const CREATE = require('../dict/commander/CREATE');

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

  const entryPath = await selectPath(
    paths.currentPath,
    {
      message: CREATE.PROMPT.SELECT_ENTRY_PATH,
      fileType: 'DIR',
      noPrefixDot: true,
      root: true,
    }
  );

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

  const config = {
    entry: {
      path: paths.getRelative(paths.currentPath, entryPath)
    },
    output: {
      path: paths.getRelative(paths.currentPath, outputPath),
      filename: outputFilename
    },
  };

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
    const packageJson = require(paths.packageJsonPath);

    const statement =
`/**
 * ${CONFIG.FILENAME}
 *
 * bash: ${packageJson.name} create
 * Description: ${packageJson.description}
 * version: ${packageJson.version}
 * */
module.exports = {
  entry: {
    path: '${config.entry.path}',
  },
  output: {
    path: '${config.output.path}',
    filename: '${config.output.filename}',
  },
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
        ignoreContent += `
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