const path = require('path');
const CONFIG = require('../dict/common/CONFIG');
const std = require('std-terminal-logger');

function mergeOptionToConfig({ input, output, format }, config) {
  if (input) {
    config.entry.path = input;
  }

  if (output) {
    const outputParse = path.parse(output);
    config.output.path = outputParse.dir || './';
    if (outputParse.base) {
      config.output.filename = outputParse.base;
    }
  }

  if (format && [CONFIG.ES_MODULE, CONFIG.COMMONJS].includes(format)) {
    config.moduleType = format
  }

  return config;
}

module.exports = mergeOptionToConfig;