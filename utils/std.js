const colors = require('colors');
const { typeOf } = require('../utils/common');

function adapter(msg) {
  if (msg) {
    if (typeOf(msg) === 'string') {
      return msg;
    }
    return JSON.stringify(msg);
  }
  return '';
}

function log(msg, ...rest) {
  console.log(' LOG '.bgWhite.black, adapter(msg).trim().white, ...rest);
}

function info(msg, ...rest) {
  console.log(' INFO '.bgBrightBlue.black, adapter(msg).trim().brightBlue, ...rest);
}

function success(msg, ...rest) {
  console.log(' SUCCESS '.bgBrightGreen.black, adapter(msg).trim().brightGreen, ...rest);
}

function warn(msg, ...rest) {
  console.log(' WARN '.bgYellow.black, adapter(msg).trim().yellow, ...rest);
}

function error(msg, ...rest) {
  console.log(' ERROR '.bgBrightRed.black, adapter(msg).trim().brightRed, ...rest);
}

module.exports = {
  log,
  info,
  success,
  warn,
  error,
};
