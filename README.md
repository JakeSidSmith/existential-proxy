# existential-proxy

**Type safe existential property access using ES6 proxies**

## About

[Optional chaining](https://github.com/tc39/proposal-optional-chaining) in JavaScript / TypeScript is not yet finalized, and so we need a way to safely access nested values that may or may not exist.

This library was created for use with TypeScript to give sensible types when accessing nullable nested values without having to specify the types yourself.

Although designed with TypeScript in mind, existential-proxy works perfectly well with JavaScript.

### Future plans

Although this library currently only offers the ability to `get` values from a nested object, I intend to add the ability to `set` or `update` (with a function) nested values in an immutable way. This is something that optional chaining would not necessarily provide.

## Installation

Install existential-proxy with NPM (`-S` will automatically add this to your `package.json`):

```shell
npm i existential-proxy -S
```

## Usage

### Get

The `get` function takes 3 arguments:

1. The object from which you wish to retrieve a value
2. A callback that will be passed a proxy to this object
3. An optional default value

Simply import the library and begin accessing the keys that you want via the proxy.

```typescript
import * as ep from 'existential-proxy';

// Here's our example type
interface ABC {
  a: {
    b?: {
      c: string
    }
  } | null;
}

// Here's our example object
const abc: ABC = {
  a: {} // Note that the b key does not exist
};

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
