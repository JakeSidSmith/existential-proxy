import { MAGIC_PROXY_SYMBOL } from './constants';

export interface AccessProxy<T> {
  [MAGIC_PROXY_SYMBOL]: T;
}

export interface WithProxyArray<T, U> extends ReadonlyArray<WithProxy<T | U>> {}

export type WithProxyObject<T, U> = { [P in keyof T]-?: WithProxy<T[P] | U> };

export type WithProxy<
  T,
  U = T extends undefined | null ? undefined : never,
  S = Exclude<T, undefined | null>
> = S extends object
  ? WithProxyObject<T, U> & AccessProxy<T>
  : S extends ReadonlyArray<infer V>
  ? WithProxyArray<V, U> & AccessProxy<T>
  : U | T & AccessProxy<T>;
