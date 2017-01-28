// TODO: properly test this
const errors = require('./human-error')({
  url: key => `https://example.com/${key}`
});

describe('human-error', () => {
  it('loads', () => {
    expect(errors).not.toBe(undefined);
    expect(errors).not.toBe(null);
    expect(errors).not.toBe(false);
  });

  it('throws error if not defined', () => {
    expect(() => errors.Three()).toThrow();
    errors.One = () => '';
    errors.Two = () => '';
    expect(() => errors.Three()).toThrow();
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
    expect(msg.includes('https://example.com/SaveOne')).toBe(true);
  });

  it('sets the url to show', () => {
    const errors = require('./human-error')({ url: 'https://example.com/' });
    errors.SaveOne = () => 'Hello world';
    let msg = errors.SaveOne().message;
    expect(msg.includes('https://example.com/')).toBe(true);
  });

  it('can generate a plain one without url', () => {
    const errors = require('./human-error')({ plain: true });
    errors.SaveOne = () => 'Hello world';
    let msg = errors.SaveOne().message;
    expect(msg.includes('┌')).toBe(false);
  });

  it('can generate a plain one with url', () => {
    const errors = require('./human-error')({ url: 'https://example.com/', plain: true });
    errors.SaveOne = () => 'Hello world';
    let msg = errors.SaveOne().message;
    expect(msg.includes('┌')).toBe(false);
  });
});



const { line, char } = require('./human-error');

describe('helpers', () => {
  it('works empty', () => {
    char();
    expect(char()).toBe('');
    line();
    expect(line()).toBe('                                                                            ');
  });

  it('returns a N char string', () => {
    expect(char('a', 6).length).toBe(6);
    expect(char('a', 6)).toBe('aaaaaa');
  });

  it('returns a N-2 char string', () => {
    expect(line('a', 10).length).toBe(6);
    expect(line('a', 10)).toBe('a     ');
  });

  it('defaults to empty chars', () => {
    expect(char(undefined, 6).length).toBe(6);
    expect(char(undefined, 6)).toMatch(/^\s+$/);
    expect(line()).toMatch(/^\s+$/);
  });

  it('keeps them whole if too large', () => {
    let str = Array(100).join(' ');
    expect(line(str)).toBe(str);
  });
});
