import { get } from '../src';

describe('get', () => {
  interface FooBar {
    foo: {
      bar?: {
        baz: string;
      };
    } | null;
  }

  const obj1: FooBar = {
    foo: {
      bar: {
        baz: 'baz',
      },
    },
  };

  it('should return the requested value', () => {
    const root = get(obj1, proxy => proxy);
    const foo1 = get(obj1, proxy => proxy.foo);
    const bar1 = get(obj1, proxy => proxy.foo.bar);
    const baz1 = get(obj1, proxy => proxy.foo.bar.baz);

    expect(root).toEqual({ foo: { bar: { baz: 'baz' } } });
    expect(foo1).toEqual({ bar: { baz: 'baz' } });
    expect(bar1).toEqual({ baz: 'baz' });
    expect(baz1).toBe('baz');
  });
});
