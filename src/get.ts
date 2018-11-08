const MAGIC_PROXY_SYMBOL = Symbol('Magic proxy symbol');

export interface AccessProxy<T> {
  [MAGIC_PROXY_SYMBOL]: T;
}

export interface WithProxyArray<T> extends ReadonlyArray<WithProxy<T>> {}

export type WithProxyObject<T> = { [P in keyof T]-?: WithProxy<T[P]> };

export type WithProxy<T, S = Exclude<T, undefined | null>> = S extends object
  ? WithProxyObject<S> & AccessProxy<T>
  : S extends ReadonlyArray<infer V> & AccessProxy<T>
  ? WithProxyArray<V>
  : T & AccessProxy<T>;

export function get<T extends object, R>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>
): R;
export function get<T extends object, R, D extends Exclude<R, undefined>>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  defaultValue: D
): D;
export function get<T extends object, R, D extends R>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  defaultValue?: D
): R {
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
