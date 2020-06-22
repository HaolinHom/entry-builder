const { typeOf } = require('../utils/common');
const CONFIG = require('../dict/common/CONFIG');

// 配置设配器
function configAdapter(cfg) {
  if (typeOf(cfg.entry) === 'string') {
    cfg.entry = {
      path: cfg.entry,
    };
  }

  if (typeOf(cfg.output) === 'string') {
    cfg.output = {
      path: cfg.output,
      filename: CONFIG.DEFAULT_OUTPUT_FILENAME
    };
  } else if (typeOf(cfg.output.filename) === 'undefined') {
    cfg.output.filename = CONFIG.DEFAULT_OUTPUT_FILENAME;
  }

  return cfg;
}

module.exports = configAdapter;