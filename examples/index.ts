// tslint:disable:no-console

import { get } from '../src';

interface FooBar {
  foo: {
    bar?: {
      baz: string;
    };
  } | null;
}

const fooBar: FooBar = {
  foo: null,
};

const final = get(fooBar, proxy => proxy.foo.bar, { baz: 'baz' });

console.log(final);
