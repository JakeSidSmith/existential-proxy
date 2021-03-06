import { MATCHES_INT } from './constants';

export function setIn(input: any, keys: ReadonlyArray<string>, newValue: any) {
  if (!keys.length) {
    return newValue;
  }

  const [firstKey, ...restKeys] = keys;
  const key = MATCHES_INT.test(firstKey) ? parseFloat(firstKey) : firstKey;
  let copy: any;

  if (input === null || typeof input === 'undefined') {
    copy = typeof key === 'number' ? [] : {};
  } else {
    copy = Array.isArray(input) ? [...input] : { ...(input as any) };
  }

  copy[key] = setIn(copy[key], restKeys, newValue);

  return copy;
}
