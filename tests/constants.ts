import * as CONSTANTS from '../src/constants';

describe('constants', () => {
  it('should export a single symbol', () => {
    expect(Object.keys(CONSTANTS)).toEqual(['MAGIC_PROXY_SYMBOL']);
    expect(typeof CONSTANTS.MAGIC_PROXY_SYMBOL).toBe('symbol');
  });
});
