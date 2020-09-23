const CONFIG = require('./CONFIG');

module.exports = {
  entry: {
    path: '',
  },
  output: {
    path: '',
    filename: '',
  },
  moduleType: '',
  ignorePath: [].concat(CONFIG.DEFAULT_IGNORE_PATH),
};
