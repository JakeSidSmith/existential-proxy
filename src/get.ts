import { WithProxy } from './types';

export function get<T extends object, R, D extends undefined | never | void>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  defaultValue?: D
): R;
export function get<T extends object, R, D>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  defaultValue: D
): R extends undefined | null ? Exclude<R, undefined | null | never> | D : R;
export function get<T extends object, R, D>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  defaultValue?: D
): any {
  let currentValue: any = input;

  const handlers = {
    get<S>(value: S, key: keyof S): object {
      currentValue = value[key];

      if (currentValue && typeof currentValue === 'object') {
        return new Proxy(currentValue, handlers);
      }

      return new Proxy({}, handlers);
    },
  };

  const proxy = new Proxy(input, handlers) as WithProxy<T>;

  callback(proxy);

  if (typeof currentValue === 'undefined' || currentValue === null) {
    if (typeof defaultValue !== 'undefined') {
      return defaultValue;
    }
  }

  return currentValue;
}
