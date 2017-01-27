const errors = {};

let char = (ch, n) => Array(n).join(ch);
let line = (msg, width = 80) => {
  if (/\n/g.test(msg)) {
    return msg.split('\n').map(l => line(l, width)).join(' │\n│ ');
  }
  if (msg.length + 4 < width) {
    return msg + char(' ', width - msg.length - 4);
  }
  return msg;
};

module.exports = ({ url, width = 80 } = {}) => new Proxy({}, {
  get: (orig, key) => {
    if (orig[key]) return orig[key];
    if (errors[key]) {
      return (opts = {}) => {
        let instance = new Error();
        let errorMsg = errors[key](opts).replace(/^\s+/mg, '').replace(/\s+$/mg, '');
        let errorUrl = false;
        if (url) {
          errorUrl = `
            │ ${line(`Info: ${url instanceof Function ? url(key) : url}`, width)} │
          `.replace(/^\s+/mg, '');
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
    }
  },
  set: (orig, key, cb) => {
    errors[key] = cb;
    return true;
  }
});
