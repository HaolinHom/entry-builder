const { typeOf } = require('../utils/common');

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
      filename: 'index'
    };
  } else if (typeOf(cfg.output.filename) === 'undefined') {
    cfg.output.filename = 'index';
  }

  return cfg;
}

module.exports = configAdapter;