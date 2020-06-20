const fs = require('fs');
const path = require('path');
const { prompt } = require('enquirer');
const std = require('../utils/std');
const paths = require('../utils/paths');
const selectPath = require('../utils/selectPath');

async function createCommand(commander) {
  const isCfgExist = fs.existsSync(paths.configFilePath);
  if (isCfgExist) {
    std.warn('entry-builder-config.js is already exist!\r\n');

    const { noRewrite } = await prompt({
      name: 'noRewrite',
      type: 'toggle',
      message: 'Do you want to rewrite entry-builder-config.js?',
      initial: true,
      enabled: 'NO',
      disabled: 'YES',
    });
    if (noRewrite) {
      return;
    }
  }

  std.info('creating entry-builder-config:');

  const entryPath = await selectPath(
    paths.currentPath,
    {
      message: 'Please select the entry directory path:',
      fileType: 'DIR',
      noPrefixDot: true,
    }
  );

  const outputPath = await selectPath(
    paths.currentPath,
    {
      message: 'Please select the path you want to build an entry file:',
      fileType: 'DIR',
      noPrefixDot: true,
      root: true,
    }
  );

  const { outputFilename } = await prompt({
    type: 'input',
    name: 'outputFilename',
    initial: 'index',
    message: 'Please enter the output file name:'
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
      message: 'Do you want to create a config file(entry-builder-config.js)?',
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
 * ${packageJson.name}-config
 *
 * Shell: ${packageJson.name} create
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

    fs.writeFileSync(path.join(paths.currentPath, 'entry-builder-config.js'), statement, { encoding: 'utf8' });

    const isIgnoreExist = fs.existsSync(paths.gitIgnorePath);
    if (isIgnoreExist) {
      const { addIgnore } = await prompt({
        name: 'addIgnore',
        type: 'toggle',
        message: 'Do you want to add entry-builder-config.js in .gitignore?',
        initial: false,
        enabled: 'YES',
        disabled: 'NO',
      });
      if (addIgnore) {
        let ignoreContent = fs.readFileSync(paths.gitIgnorePath, { encoding: 'utf8' });
        ignoreContent += `
# entry-builder
entry-builder-config.js
`;
        fs.writeFileSync(paths.gitIgnorePath, ignoreContent, { encoding: 'utf8' });
      }
    }

    std.success('entry-builder-config.js is created!');
  }

  return config;
}

module.exports = createCommand;