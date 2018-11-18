# existential-proxy

[![CircleCI](https://circleci.com/gh/JakeSidSmith/existential-proxy.svg?style=svg)](https://circleci.com/gh/JakeSidSmith/existential-proxy)

**Type safe existential property access using ES6 proxies**

## About

This library gives you the ability to `get`, `set`, or `update` (with an update function) values nested within an object who's keys may be nullable (`undefined` or `null`), without mutating the original input, or having to worry about checking for values' existence.

[Optional chaining](https://github.com/tc39/proposal-optional-chaining) in JavaScript / TypeScript is not yet finalized, and so we need a way to safely access nested values that may or may not exist.

This library was created for use with TypeScript to give sensible types when accessing nullable nested values without having to specify the types yourself.

Although designed with TypeScript in mind, existential-proxy works perfectly well with JavaScript.

Unlike destructuring with default values existential-proxy allows access through values that may be `undefined` or `null` without specifying default values for each level, and allows specifying defaults even when the value may be `null`.

Additionally, unlike (some) alternatives that allow access to nested properties this library also allows setting or updating values inside a nested object in an immutable way (returning a copy of the input with updated values as necessary).

### Future plans

I intend to add a function to create a selector, much like [reselect](https://github.com/reduxjs/reselect), to allow transforming values only when changed, but using proxies removing the need to null check nested values.

## Installation

Install existential-proxy with NPM (`-S` will automatically add this to your `package.json`):

```shell
npm i existential-proxy -S
```

## Usage

I'd recommend importing `* as` so that you can easily tell where the functions are coming from, and avoid naming conflicts (as many libraries will use similarly named functions).

```typescript
import * as ep from 'existential-proxy';
```

Almost all of the examples below will use the following types / object.

```typescript
// Here's an example object type
interface ABC {
  a: {
    b?: {
      c: string;
    };
  } | null;
}

// Here's our example object
const abc: ABC = {
  a: {} // Note that the b key does not exist
};
```

### Get

The `get` function takes 3 arguments:

1. The object from which you wish to retrieve a value
2. A callback that will be passed a proxy to this object
3. An optional default value

```typescript
// Access without defaults
ep.get(abc, (proxy) => proxy); // ABC
ep.get(abc, (proxy) => proxy.a); // { b?: { c: string; } } | null
ep.get(abc, (proxy) => proxy.a.b); // { c: string; } | undefined
ep.get(abc, (proxy) => proxy.a.b.c); // string | undefined

// Access with defaults
ep.get(abc, (proxy) => proxy, 'whatever'); // ABC
ep.get(abc, (proxy) => proxy.a, { b: { c: 'hello' } }); // { b?: { c: string; } } | { b: { c: string; } }
ep.get(abc, (proxy) => proxy.a.b, { c: 'hello' }); // { c: string; }
ep.get(abc, (proxy) => proxy.a.b.c, 'hello'); // string
```

### Set

The `set` function takes 3 arguments:

1. The object from which you wish to retrieve a value
2. A callback that will be passed a proxy to this object
3. The new value to be set at the returned proxy key



```typescript
// Will return the provided value (essentially replacing the input object)
ep.set(abc, (proxy) => proxy, { a: { b: { c: 'hello' } } }); // { a: { b: { c: 'hello' } } }: ABC
// Will return a copy of the `abc` object with a new `a` value
ep.set(abc, (proxy) => proxy.a, { b: { c: 'hello' } }); // { a: { b: { c: 'hello' } } }: ABC
// Will return a copy of the `abc` object with a new `b` value
ep.set(abc, (proxy) => proxy.a.b, { c: 'hello' }); // { a: { b: { c: 'hello' } } }: ABC
```

### Update

The `update` function takes 3 arguments:

1. The object from which you wish to retrieve a value
2. A callback that will be passed a proxy to this object
3. An updater function that will be passed the existing value at the returned proxy key, and returns a new value

```typescript
// Will return the returned value (essentially replacing the input object)
ep.update(abc, (proxy) => proxy, () => ({ a: { b: { c: 'hello' } } })); // { a: { b: { c: 'hello' } } }: ABC
// Will return a copy of the `abc` object with a new `a` value if it is not defined
ep.update(abc, (proxy) => proxy.a, (a) => {
  if (!a) {
    return { b: { c: 'hello' } };
  }

  return a;
}); // { a: { b: { c: 'hello' } } }: ABC
// Will return a copy of the `abc` object with a new `b` value if it is not defined
ep.update(abc, (proxy) => proxy.a.b, (b) => {
  if (!b) {
    return { c: 'hello' };
  }

  return b;
}); // { a: { b: { c: 'hello' } } }: ABC
```

## Important notes

When using `set` and `update` you should note that:

1. The return type will always match the input type - if keys are nullable, they will still be nullable even if set by one of these functions
2. Keys that when cast to a number are a valid integer (including negative values) will produce arrays if the parent object is `undefined` or `null`. This is because there is no way to detect if trying to access values from an array or object if the target is not already an array or object (all keys; `.a`, `[0]`, are only available as strings when using a proxy).

## Example of potentially unintended array creation

This library's `set` and `update` functions may not give you the output you'd expect if you are using integers as keys in objects.

```typescript
interface NumKey {
  a?: {
    0: string;
  };
}

const numKey: NumKey = {};

// Will create an array when trying to access the `0` key
ep.set(numKey, (proxy) => proxy.a[0], 'hello'); // { a: ['hello'] }: NumKey
// Will still create an array when trying to access the `0` key
ep.set(numKey, (proxy) => proxy.a['0'], 'hello'); // { a: ['hello'] }: NumKey
```
