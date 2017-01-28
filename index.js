const errors = require('./human-error')({
  url: key => `https://example.com/error/${key}`
});

errors.One = () => '';
errors.Two = () => '';
errors.Three();
