const MAGIC_SYMBOL = Symbol('Magic proxy symbol');

interface AccessProxy<T> {
  [MAGIC_SYMBOL]: T;
}

interface WithProxyArray<T> extends ReadonlyArray<WithProxy<T>> {}

type WithProxyObject<T> = { [P in keyof T]-?: WithProxy<T[P]> };

type WithProxy<T, S = Exclude<T, undefined | null>> = S extends object
  ? WithProxyObject<S> & AccessProxy<T>
  : S extends ReadonlyArray<infer V> & AccessProxy<T>
  ? WithProxyArray<V>
  : T & AccessProxy<T>;

export function get<T extends object, R, D extends R>(
  input: T,
  callback: (input: WithProxy<T>) => R & AccessProxy<R>
): R;
export function get<T extends object, R, D extends R>(
  input: T,
  callback: (input: WithProxy<T>) => R & AccessProxy<R>,
  defaultValue: D
): R extends null | undefined ? D : R;
export function get<T extends object, R, D extends R>(
  input: T,
  callback: (input: WithProxy<T>) => R & AccessProxy<R>,
  defaultValue?: D
): R | D {
  let currentValue: any = input;

  const handlers = {
    get(value: T, key: keyof T): object {
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
