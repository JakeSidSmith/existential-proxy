import { WithProxy } from './types';
import { setIn } from './utils';

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
