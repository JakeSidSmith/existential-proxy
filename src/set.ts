import { WithProxy } from './types';

export function setIn(input: any, keys: ReadonlyArray<string>, newValue: any) {
  if (!keys.length) {
    return newValue;
  }

  const [firstKey, ...restKeys] = keys;
  const key = Number.isFinite(parseFloat(firstKey))
    ? parseFloat(firstKey)
    : firstKey;
  let copy: any;

  if (input === null || typeof input === 'undefined') {
    copy = typeof key === 'number' ? [] : {};
  } else {
    copy = Array.isArray(input) ? [...input] : { ...(input as any) };
  }

  copy[key] = setIn(copy[key], restKeys, newValue);

  return copy;
}

export function set<T extends object, R>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  newValue: R
): T {
  const keys: string[] = [];

  const handlers = {
    get(_value: any, key: string): object {
      keys.push(key);

      return new Proxy({}, handlers);
    },
  };

  const proxy = new Proxy({}, handlers) as WithProxy<T>;

  callback(proxy);

  return setIn(input, keys, newValue);
}
