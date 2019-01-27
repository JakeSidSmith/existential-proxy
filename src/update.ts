import { MAGIC_PROXY_SYMBOL } from './constants';
import { AccessProxy, Recurse, WithProxy } from './types';
import { setIn } from './utils';

export function update<T extends object, R>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  updater: (value: R) => R
): T {
  const handlers = {
    get(value: Recurse<any>, key: string | symbol): object {
      if (typeof key === 'symbol' && key === MAGIC_PROXY_SYMBOL) {
        return value;
      }
      const keyString = key as string;
      const currentValue = value.val[key];

      const keys = value.keys.concat([keyString]);
      if (currentValue && typeof currentValue === 'object') {
        return new Proxy({ keys, val: currentValue }, handlers);
      }

      return new Proxy({ keys, val: {} }, handlers);
    },
  };

  const proxy = new Proxy({ keys: [], val: input }, handlers) as WithProxy<T>;

  const mapped = callback(proxy);
  const unwrapped = (mapped as any as AccessProxy<Recurse<R>>)[MAGIC_PROXY_SYMBOL];

  return setIn(input, unwrapped.keys, updater(unwrapped.val)) as T;
}
