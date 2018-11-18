import { WithProxy } from './types';
import { setIn } from './utils';

export function update<T extends object, R>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  updater: (value: R) => R
): T {
  const keys: string[] = [];
  let currentValue: any = input;

  const handlers = {
    get(value: any, key: string): object {
      keys.push(key as string);
      currentValue = value[key];

      if (currentValue && typeof currentValue === 'object') {
        return new Proxy(currentValue, handlers);
      }

      return new Proxy({}, handlers);
    },
  };

  const proxy = new Proxy(input, handlers) as WithProxy<T>;

  callback(proxy);

  return setIn(input, keys, updater(currentValue));
}
