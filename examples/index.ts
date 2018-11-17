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
