const { typeOf } = require('../utils/common');
const std = require('std-terminal-logger');
const ERROR = require('../dict/utils/ERROR');
const CONFIG = require('../dict/common/CONFIG');

function validateRule(cfg) {
  if (cfg) {
    let result = true;

    // TODO: Verify path, filename is it allow

    const entryType = typeOf(cfg.entry);
    if (entryType === 'undefined') {
      std.error(ERROR.CONFIG_ENTRY_NOT_EXIST);
      result = false;
    } else if (entryType === 'object') {

      const entryPathType = typeOf(cfg.entry.path);
      if (entryPathType === 'undefined') {
        std.error(ERROR.CONFIG_ENTRY_PATH_NOT_EXIST);
        result = false;
      } else if (typeOf(cfg.entry.path) !== 'string') {
        std.error(ERROR.CONFIG_ENTRY_PATH_NOT_STRING);
        result = false;
      }

    } else if (entryType !== 'string') {
      std.error(ERROR.CONFIG_ENTRY_ILLEGAL);
      result = false;
    }

    const outputType = typeOf(cfg.output);
    if (outputType === 'undefined') {
      std.error(ERROR.CONFIG_OUTPUT_NOT_EXIST);
      result = false;
    } else if (outputType === 'object') {
      if (!cfg.output.path) {
        std.error(ERROR.CONFIG_OUTPUT_PATH_NOT_EXIST);
        result = false;
      } else if (typeOf(cfg.output.path) !== 'string') {
        std.error(ERROR.CONFIG_OUTPUT_PATH_NOT_STRING);
        result = false;
      }
      if (cfg.output.filename && typeOf(cfg.output.filename) !== 'string') {
        std.error(ERROR.CONFIG_OUTPUT_FILENAME_NOT_STRING);
        result = false;
      }
    } else if (outputType !== 'string') {
      std.error(ERROR.CONFIG_OUTPUT_ILLEGAL);
      result = false;
    }

    const moduleType = typeOf(cfg.moduleType);
    if (moduleType === 'undefined') {
      std.error(ERROR.CONFIG_MODULE_TYPE_NOT_EXIST);
      result = false;
    } else if (moduleType !== 'string') {
      std.error(ERROR.CONFIG_MODULE_TYPE_NOT_STRING);
      result = false;
    } else if (![CONFIG.ES_MODULE, CONFIG.COMMONJS].includes(cfg.moduleType)) {
      std.error(`${ERROR.CONFIG_MODULE_TYPE_ILLEGAL}`);
      result = false;
    }

    return result;
  }

  std.error(ERROR.CONFIG_NOT_EXIST);
  return false;
}

// Verify configuration file
function validateConfig(cfg) {
  if (!Array.isArray(cfg)) {
    cfg = [cfg];
  }

  return cfg.some(cfgItem => validateRule(cfgItem));
}

module.exports = validateConfig;
