// tslint:disable:no-console

import * as ep from '../src';

interface ABC {
  a: {
    b?: {
      c: string;
    };
  } | null;
}

const abc: ABC = {
  a: null,
};

const b = ep.get(abc, proxy => proxy.a.b, { c: 'c' });

console.log(b);

interface NumKey {
  a?: {
    0: string;
  };
}

const numKey: NumKey = {};

// Will create an array when trying to access the `0` key
const numKeyResult = ep.set(numKey, proxy => proxy.a[0], 'hello'); // { a: ['hello'] }:

console.log(numKeyResult);

const updated = ep.update(abc, proxy => proxy.a.b.c, value => {
  if (typeof value === 'string') {
    return 'already existed';
  }

  return 'was not defined';
});

console.log(updated);
