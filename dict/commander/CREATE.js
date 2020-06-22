const CONFIG = require('../common/CONFIG');

module.exports = {
  PROMPT: {
    REWRITE_CONFIG_FILE: `Do you want to rewrite ${CONFIG.FILE}?`,
    SELECT_ENTRY_PATH: 'Please select the entry directory path: ',
    SELECT_OUTPUT_PATH: 'Please select the path you want to build an entry file: ',
    INPUT_OUTPUT_FILENAME: 'Please enter the output file name: ',
    TOGGLE_CREATE_CONFIG_FILE: `Do you want to create a config file(${CONFIG.FILE})?`,
    TOGGLE_ADD_IN_GIT_IGNORE: `Do you want to add ${CONFIG.FILE} in ${CONFIG.GIT_IGNORE}?`
  },
  INFO: {
    RUNNING: `Creating ${CONFIG.FILENAME}:`,
  },
  WARN: {
    CONFIG_FILE_EXIST: `${CONFIG.FILE} is already exist!\r\n`,
  },
  SUCCESS: {
    FINISH_CREATE: `${CONFIG.FILE} is created.`,
  },
};
