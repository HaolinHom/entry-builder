const CONFIG = require('../common/CONFIG');

module.exports = {
  CONFIG_NOT_EXIST: 'Config isn\'t existed!',

  CONFIG_ENTRY_ILLEGAL: 'Config\'s entry is illegal!',
  CONFIG_ENTRY_NOT_EXIST: 'Config\'s entry isn\'t existed!',
  CONFIG_ENTRY_PATH_NOT_STRING: 'Config\'s entry.path must be a string!',
  CONFIG_ENTRY_PATH_NOT_EXIST: 'Config\'s entry.path isn\'t existed!',

  CONFIG_OUTPUT_ILLEGAL: 'Config\'s output is illegal!',
  CONFIG_OUTPUT_NOT_EXIST: 'Config\'s output isn\'t existed!',
  CONFIG_OUTPUT_PATH_NOT_STRING: 'Config\'s entry.path must be a string!',
  CONFIG_OUTPUT_PATH_NOT_EXIST: 'Config\'s entry.path isn\'t existed!',
  CONFIG_OUTPUT_FILENAME_NOT_STRING: 'Config\'s entry.filename must be a string!',

  CONFIG_MODULE_TYPE_NOT_EXIST: 'Config\'s moduleType isn\'t existed!',
  CONFIG_MODULE_TYPE_NOT_STRING: 'Config\'s moduleType must be a string!',
  CONFIG_MODULE_TYPE_ILLEGAL: `Config's moduleType is illegal! (must be ${CONFIG.ES_MODULE} or ${CONFIG.COMMONJS})`,
};
