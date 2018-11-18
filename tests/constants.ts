import * as CONSTANTS from '../src/constants';

describe('constants', () => {
  it('should export some constants', () => {
    expect(Object.keys(CONSTANTS)).toEqual([
      'MAGIC_PROXY_SYMBOL',
      'MATCHES_INT',
    ]);
    expect(typeof CONSTANTS.MAGIC_PROXY_SYMBOL).toBe('symbol');
    expect(CONSTANTS.MATCHES_INT instanceof RegExp).toBe(true);
  });

  describe('MATCHES_INT', () => {
    it('should test for strings that represent valid integers', () => {
      expect(CONSTANTS.MATCHES_INT.test('')).toBe(false);
      expect(CONSTANTS.MATCHES_INT.test('0.1')).toBe(false);
      expect(CONSTANTS.MATCHES_INT.test('-0.1')).toBe(false);
      expect(CONSTANTS.MATCHES_INT.test('1a')).toBe(false);
      expect(CONSTANTS.MATCHES_INT.test('a1')).toBe(false);
      expect(CONSTANTS.MATCHES_INT.test(' 1')).toBe(false);
      expect(CONSTANTS.MATCHES_INT.test('1 ')).toBe(false);

      expect(CONSTANTS.MATCHES_INT.test('1')).toBe(true);
      expect(CONSTANTS.MATCHES_INT.test('-1')).toBe(true);
      expect(CONSTANTS.MATCHES_INT.test('123')).toBe(true);
      expect(CONSTANTS.MATCHES_INT.test('-123')).toBe(true);
    });
  });
});
