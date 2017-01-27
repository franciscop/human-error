// TODO: properly test this
const errors = require('./human-error')({
  url: key => `https://example.com/error#${key}`
});

describe('human-error', () => {
  it('loads', () => {
    expect(errors).not.toBe(undefined);
    expect(errors).not.toBe(null);
    expect(errors).not.toBe(false);
  });

  it('can add an error', () => {
    errors.SaveOne = () => {};
    expect(errors.SaveOne instanceof Function).toBe(true);
  });

  it('can use an error', done => {
    errors.saveAnother = () => { done(); };
    errors.saveAnother();
  });

  it('should return an error', () => {
    errors.SaveOne = () => 'Hello 世界';
    expect(errors.SaveOne() instanceof Error).toBe(true);
  });

  it('uses default arguments', () => {
    errors.SaveOne = ({ type = 'a' }) => {
      expect(type).toBe('a');
      return '';
    };
    errors.SaveOne();
  });

  it('can be passed arguments', () => {
    errors.SaveOne = ({ type = 'a' }) => {
      expect(type).toBe('b');
      return '';
    };
    errors.SaveOne({ type: 'b' });
  });

  it('sets the error to show', () => {
    errors.SaveOne = () => 'Hello world';
    let msg = errors.SaveOne().message;
    expect(msg.includes('Hello world')).toBe(true);
  });

  it('sets the url to show', () => {
    errors.SaveOne = () => 'Hello world';
    let msg = errors.SaveOne().message;
    expect(msg.includes('https://example.com/error#SaveOne')).toBe(true);
  });
});
