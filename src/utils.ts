import { MATCHES_INT } from './constants';

const GetType = (firstKey: string) => {
  const key = (MATCHES_INT.test(firstKey) ? parseFloat(firstKey) : firstKey);
  return typeof key === 'number' ? "array" : "object"
}

const IsEmpty = <I>(input: I) => {
  return input === null || typeof input === 'undefined';
}

const createObject = <I>(input: I, keyName: string) => {
  if (IsEmpty(input)) {
    const keyType = GetType(keyName);
    return (keyType === 'array' ? [] : {}) as I;
  } else {
    return (Array.isArray(input) ? [...input] : { ...(input) }) as I;
  }
}

export function setIn<I, R>(input: I, keys: ReadonlyArray<string>, newValue: R): I | R {
  if (!keys.length) {
    // at this point I === R
    return newValue;
  }

  const [firstKey, ...restKeys] = keys;
  const copy = createObject(input, firstKey);
  
  const typedKey = firstKey as keyof I;
  (copy[typedKey] as any) = setIn(copy[typedKey], restKeys, newValue);

  return copy;
}