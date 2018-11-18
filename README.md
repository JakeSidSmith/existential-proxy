# existential-proxy

[![CircleCI](https://circleci.com/gh/JakeSidSmith/existential-proxy.svg?style=svg)](https://circleci.com/gh/JakeSidSmith/existential-proxy)

**Type safe existential property access using ES6 proxies**

## About

[Optional chaining](https://github.com/tc39/proposal-optional-chaining) in JavaScript / TypeScript is not yet finalized, and so we need a way to safely access nested values that may or may not exist.

This library was created for use with TypeScript to give sensible types when accessing nullable nested values without having to specify the types yourself.

Although designed with TypeScript in mind, existential-proxy works perfectly well with JavaScript.

Unlike destructuring with default values existential-proxy allows access through values that may be `undefined` or `null` without specifying default values for each level, and allows specifying defaults even what the value may be `null`.

Additionally, unlike (some) alternatives that allow access to nested properties this library also allows setting values inside a nested object in an immutable way (returning a copy of the input with updated values as necessary).

### Future plans

Although this library currently only offers the ability to `get` values from a nested object, and `set` values inside a nested object, I intend to add the ability to `update` (with a function) nested values in an immutable way. This is something that optional chaining would not necessarily provide.

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

Almost of the examples below will use the following types / object.

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

Some important things to note:

1. The return type will always match the input type - if keys are nullable, they will still be nullable even if set by this function
2. Keys that when cast to a number are finite numbers will produce arrays if the parent object is undefined or null. This is because there is no way to detect if trying to access values from an array or object if the target is undefined or null (all keys; `.a`, `[0]`, are only available as strings when using a proxy).

```typescript
// Will return the provided value (essentially replacing the input object)
ep.set(abc, (proxy) => proxy, { a: { b: { c: 'hello' } } }); // { a: { b: { c: 'hello' } } }: ABC
// Will return a copy of the `abc` object with a new `a` value
ep.set(abc, (proxy) => proxy.a, { b: { c: 'hello' } } }); // { a: { b: { c: 'hello' } } }: ABC
// Will return a copy of the `abc` object with a new `b` value
ep.set(abc, (proxy) => proxy.a.b, { c: 'hello' } }); // { a: { b: { c: 'hello' } } }: ABC
```

This library's `set` function may not give you the output you'd expect if you are using numbers as keys in objects.

```typescript
interface NumKey {
  a?: {
    0: string;
  };
}

const numKey: NumKey = {};

// Will create an array when trying to access the `0` key
ep.set(numKey, (proxy) => proxy.a[0], 'hello'); // { a: ['hello'] }:
// Will still create an array when trying to access the `0` key
ep.set(numKey, (proxy) => proxy.a['0'], 'hello'); // { a: ['hello'] }:
```
