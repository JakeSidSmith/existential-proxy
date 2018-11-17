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

