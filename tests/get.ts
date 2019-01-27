import * as ep from '../src';

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

  const obj3: FooBar = {
    foo: {
      bar: null,
    },
  };

  it('should return the requested value when it exists', () => {
    const root = ep.get(obj1, proxy => proxy);
    const foo = ep.get(obj1, proxy => proxy.foo);
    const bar = ep.get(obj1, proxy => proxy.foo.bar);
    const baz = ep.get(obj1, proxy => proxy.foo.bar.baz);

    expect(root).toEqual({ foo: { bar: { baz: 'baz' } } });
    expect(foo).toEqual({ bar: { baz: 'baz' } });
    expect(bar).toEqual({ baz: 'baz' });
    expect(baz).toBe('baz');
  });

  it('should return undefined when the value does not exist', () => {
    const root = ep.get(obj2, proxy => proxy);
    const foo = ep.get(obj2, proxy => proxy.foo);
    const bar = ep.get(obj2, proxy => proxy.foo.bar);
    const baz = ep.get(obj2, proxy => proxy.foo.bar.baz);

    expect(root).toEqual({});
    expect(foo).toBe(undefined);
    expect(bar).toBe(undefined);
    expect(baz).toBe(undefined);
  });

  it('should return the default value when the value does not exist', () => {
    const root = ep.get(obj2, proxy => proxy, { foo: undefined });
    const foo = ep.get(obj2, proxy => proxy.foo, { bar: null });
    const bar = ep.get(obj2, proxy => proxy.foo.bar, { baz: 'def' });
    const baz = ep.get(obj2, proxy => proxy.foo.bar.baz, 'def');

    expect(root).toEqual({});
    expect(foo).toEqual({ bar: null });
    expect(bar).toEqual({ baz: 'def' });
    expect(baz).toBe('def');
  });

  it('should return the default value when the value is null', () => {
    const root = ep.get(obj3, proxy => proxy, { foo: undefined });
    const foo = ep.get(obj3, proxy => proxy.foo, { bar: { baz: 'def' } });
    const bar = ep.get(obj3, proxy => proxy.foo.bar, { baz: 'def' });
    const baz = ep.get(obj3, proxy => proxy.foo.bar.baz, 'def');

    expect(root).toEqual({ foo: { bar: null } });
    expect(foo).toEqual({ bar: null });
    expect(bar).toEqual({ baz: 'def' });
    expect(baz).toBe('def');
  });

  it('should not return anything when the symbol as a string is used to request something', () => {
    const sut = ep.get(obj1, proxy => (proxy as any)['Magic proxy symbol']);
    expect(sut).toEqual(undefined);
  })
});
