import { WithProxy } from './types';

export function setIn<T extends object>(
  input: T,
  keys: ReadonlyArray<string>,
  newValue: any
) {
  if (!keys.length) {
    return newValue;
  }

  const copy = Array.isArray(input) ? [...input] : { ...(input as any) };
  const [firstKey, ...restKeys] = keys;

  if (copy[firstKey] === null || typeof copy[firstKey] === 'undefined') {
    copy[firstKey] = Number.isFinite(parseFloat(firstKey)) ? [] : {};
  }

  copy[firstKey] = setIn(copy[firstKey], restKeys, newValue);

  return copy;
}

export function set<T extends object, R>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  newValue: R
): T {
  const keys: string[] = [];

  const handlers = {
    get<S extends object>(value: S, key: keyof S): object {
      const currentValue: any = value[key];
      keys.push(key as string);

      if (currentValue && typeof currentValue === 'object') {
        return new Proxy(currentValue, handlers);
      }

      return new Proxy({}, handlers);
    },
  };

  const proxy = new Proxy(input, handlers) as WithProxy<T>;

  callback(proxy);

  return setIn(input, keys, newValue);
}
