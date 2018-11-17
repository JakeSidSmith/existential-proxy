// tslint:disable:no-console

import * as ep from '../src';

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

const final = ep.get(fooBar, proxy => proxy.foo.bar, { baz: 'baz' });

console.log(final);
