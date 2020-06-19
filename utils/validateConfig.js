const { typeOf } = require('../utils/common');
const std = require('../utils/std');
const ERROR = require('../dict/config/ERROR');

// 校验配置文件
function validateConfig(cfg) {
  if (cfg) {
    let result = true;

    // TODO: 校验 path, filename 是否合法

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

    return result;
  }

  std.error(ERROR.CONFIG_NOT_EXIST);
  return false;
}

module.exports = validateConfig;
