import * as CONSTANTS from '../src/constants';

describe('constants', () => {
  it('should export some constants', () => {
    expect(Object.keys(CONSTANTS)).toEqual(['MAGIC_PROXY_SYMBOL', 'MATCHES_INT']);
    expect(typeof CONSTANTS.MAGIC_PROXY_SYMBOL).toBe('symbol');
    expect(CONSTANTS.MATCHES_INT instanceof RegExp).toBe(true);
  });
});
