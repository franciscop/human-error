// Throw a built-in error quickly
// run with `node demo.js` and see the error in the terminal
const errors = require('./human-error')({
  url: key => `https://example.com/error/${key}`
});

errors.Three();
