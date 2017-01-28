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


const errorFactory = ({ url, width = 80, plain } = {}) => {
  const errors = {};
  return new Proxy(function(obj){
    let autoerror = errorFactory();
    for (let key in obj) {
      autoerror[key] = obj[key];
    }
    return autoerror;
  }, {
    get: (orig, key) => {
      const self = errorFactory()(selfErrors);

      if (!errors[key]) {
        throw self.NotDefined({ name: key, available: Object.keys(errors) });
      }

      return (opts = {}) => {
        let instance = new Error();
        let errorMsg = errors[key](opts);
        errorMsg = errorMsg
          .replace(/^\s+/, '')     // Remove leading space from 1st line
          .replace(/\s+$/, '')     // Remove ending space from 1st line
          .replace(/^\ +/mg, '')   // Remove leading indentation
          .replace(/\ +$/mg, '');  // Remove ending indentation
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
            Message: ${errorMsg}
            Code: ${key}
            URL: ${errorUrl ? errorUrl : ''}
            Arguments: ${JSON.stringify(opts, null, 2)}
          `.replace(/^\s+/mg, ''));
        }

        return new Error('\n' + `
          ┌${char('─',  width - 2)}┐
          │ ${line(key + ' Error', width)} │
          ├${char('─',  width - 2)}┤
          │ ${line(errorMsg, width)} │
          ├${char('─',  width - 2)}┤
          │ ${line('Code: ' + key, width)} │
          ${errorUrl ? errorUrl : ''}
          │ ${line('Arguments: ' + JSON.stringify(opts, null, 2), width)} │
          └${char('─',  width - 2)}┘
        `.replace(/^\s+/mg, ''));
      }
    },
    set: (orig, key, cb) => {
      errors[key] = cb;
      return true;
    }
  });
}

module.exports = errorFactory;
module.exports.char = char;
module.exports.line = line;
