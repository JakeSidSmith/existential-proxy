import { WithProxy } from './types';
import { update } from './update';

export function set<T extends object, R>(
  input: T,
  callback: (input: WithProxy<T>) => WithProxy<R>,
  newValue: R
): T {
  return update(input, callback, _ => newValue);
}
