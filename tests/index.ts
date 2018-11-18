import * as index from '../src';

describe('index', () => {
  it('exports some utility functions', () => {
    const keys = Object.keys(index) as ReadonlyArray<keyof typeof index>;

    expect(keys).toEqual(['get', 'set', 'update']);
    keys.forEach(key => {
      expect(typeof index[key]).toBe('function');
    });
  });
});
