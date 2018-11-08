import { get } from '../src';

describe('get', () => {
  interface FooBar {
    foo?: {
      bar: {
        baz: string;
      } | null;
    };
  }

  const obj1: FooBar = {
    foo: {
      bar: {
        baz: 'baz',
      },
    },
  };

  const obj2: FooBar = {};

  it('should return the requested value when it exists', () => {
    const root = get(obj1, proxy => proxy);
    const foo1 = get(obj1, proxy => proxy.foo);
    const bar1 = get(obj1, proxy => proxy.foo.bar);
    const baz1 = get(obj1, proxy => proxy.foo.bar.baz);

    expect(root).toEqual({ foo: { bar: { baz: 'baz' } } });
    expect(foo1).toEqual({ bar: { baz: 'baz' } });
    expect(bar1).toEqual({ baz: 'baz' });
    expect(baz1).toBe('baz');
  });

  it('should return undefined when the value does not exist', () => {
    const root = get(obj2, proxy => proxy);
    const foo2 = get(obj2, proxy => proxy.foo);
    const bar2 = get(obj2, proxy => proxy.foo.bar);
    const baz2 = get(obj2, proxy => proxy.foo.bar.baz);

    expect(root).toEqual({});
    expect(foo2).toBe(undefined);
    expect(bar2).toBe(undefined);
    expect(baz2).toBe(undefined);
  });

  it('should return the default value when the value does not exist', () => {
    const root = get(obj2, proxy => proxy, {foo: null});
    const foo2 = get(obj2, proxy => proxy.foo, {bar: null});
    const bar2 = get(obj2, proxy => proxy.foo.bar, {baz: 'def'});
    const baz2 = get(obj2, proxy => proxy.foo.bar.baz, 'def');

    expect(root).toEqual({});
    expect(foo2).toEqual({bar: null});
    expect(bar2).toEqual({baz: 'def'});
    expect(baz2).toBe('def');
  });
});
