// Use this library to handle this libraries' errors
const selfErrors = require('./self');

// Repeat a character N times
const char = (ch = ' ', n = 0) => Array(n + 1).join(ch);

// Make a line of length >= width with filling spaces
// It cannot cut it because we risk breaking links or others
const line = (msg = '', width = 80) => {
  if (/\n/g.test(msg)) {
    return msg.split('\n').map(l => line(l, width)).join(' │\n│ ');
  }
  if (msg.length + 4 < width) {
    return msg + char(' ', width - msg.length - 4);
  }
  return msg;
};

const buildError = ({ key, message = '', url, width, opts = {}, plain }) => {
  // DISPLAY
  message = message
    .replace(/^\s+/, '')     // Remove leading space from 1st line
    .replace(/\s+$/, '')     // Remove trailing space from last line
    .replace(/^\ +/mg, '')   // Remove leading indentation
    .replace(/\ +$/mg, '');  // Remove trailing indentation
  let errorUrl = false;

  if (url) {
    const realUrl = url instanceof Function ? url(key) : url;
    if (plain) {
      errorUrl = '\nMore info: ' + realUrl;
    } else {
      errorUrl = `
        │ ${line(`Info: ${realUrl}`, width)} │
      `.replace(/^\ +/mg, '');
    }
  }
  if (plain) {
    return new Error('\n' + `
      Error: ${key}
      Message: ${message}
      Code: ${key}
      URL: ${errorUrl ? errorUrl : ''}
      Arguments: ${JSON.stringify(opts, null, 2)}
    `.replace(/^\s+/mg, ''));
  }

  return new Error('\n' + `
    ┌${char('─',  width - 2)}┐
    │ ${line(key + ' Error', width)} │
    ├${char('─',  width - 2)}┤
    │ ${line(message, width)} │
    ├${char('─',  width - 2)}┤
    │ ${line('Code: ' + key, width)} │
    ${errorUrl ? errorUrl : ''}
    │ ${line('Arguments: ' + JSON.stringify(opts, null, 2), width)} │
    └${char('─',  width - 2)}┘
  `.replace(/^\s+/mg, ''));
};


const globalErrors = {};

const errorFactory = ({ url, width = 80, plain, extra = {} } = {}) => {
  const errors = function (key, opts = {}){
    let message = errors[key];
    if (!message){
      throw new Error(selfErrors.NotDefined({ name: key, available: Object.keys(errors) }));
    }
    if (message instanceof Function) {
      message = message(opts);
    }
    // Extend the options with the defaults
    for (let key in extra) {
      if (!opts[key]) {
        opts[key] = extra[key];
      }
    }
    let error = new Error(buildError({ key, message, url, width, plain, opts }));
    error.name = key;
    for (let key in opts) {
      error[key] = opts[key];
    }
    return error;
  };
  return errors;
}

module.exports = errorFactory;
module.exports.char = char;
module.exports.line = line;
