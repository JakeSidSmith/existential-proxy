import { MAGIC_PROXY_SYMBOL } from './constants';
import { AccessProxy, Option, WithProxy } from './types';

export function get<T extends object, R>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  defaultValue?: R
): R {
  const handlers = {
    get(value: Option<any>, key: string | symbol): any {
      if (typeof key === 'symbol' && key === MAGIC_PROXY_SYMBOL) {
        return value;
      }
      if (value.type === "Some") {
        const currentValue = value.val[key];
        if (currentValue) {
          return new Proxy({ type: "Some", val: currentValue }, handlers);
        }
      }

      return new Proxy({ type: "None" }, handlers);
    },
  };

  const proxy = new Proxy({ type: "Some", val: input }, handlers) as WithProxy<T>;

  const mapped = callback(proxy);

  const unwrapped = (mapped as any as AccessProxy<Option<R>>)[MAGIC_PROXY_SYMBOL];

  switch (unwrapped.type) {
    case "Some":
      return unwrapped.val;
    default:
      return defaultValue as R;
  }
}
