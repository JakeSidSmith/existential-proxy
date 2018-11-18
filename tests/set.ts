import { set } from '../src';

describe('set', () => {
  interface FooBar {
    foo?: {
      bar: {
        baz: string;
      } | null;
    };
    a: {
      b: 'b';
    };
  }

  const obj1: FooBar = {
    foo: {
      bar: {
        baz: 'baz',
      },
    },
    a: {
      b: 'b',
    },
  };

  const obj2: FooBar = {
    a: {
      b: 'b',
    },
  };

  it('replaces the initial object', () => {
    const newValue1 = {};
    const result1 = set(obj1, proxy => proxy, newValue1);

    expect(result1).not.toBe(obj1);
    expect(result1).toBe(newValue1);
  });

  it('sets override a value inside an object that already exists', () => {
    const newValue1 = { bar: { baz: 'hello' } };
    const result1 = set(obj1, proxy => proxy.foo, newValue1);

    expect(result1).not.toBe(obj1);
    expect(result1.foo).not.toBe(obj1.foo);

    expect(result1.a).toBe(obj1.a);
    expect(result1.a.b).toBe(obj1.a.b);

    expect(result1).toEqual({ ...obj1, foo: newValue1 });

    const newValue2 = { baz: 'hello again' };
    const result2 = set(obj1, proxy => proxy.foo.bar, newValue2);

    expect(result2).not.toBe(obj1);
    expect(result2.foo).not.toBe(obj1.foo);
    expect(result2.foo!.bar).not.toBe(obj1.foo!.bar);

    expect(result2.a).toBe(obj1.a);
    expect(result2.a.b).toBe(obj1.a.b);

    expect(result2).toEqual({ ...obj1, foo: { ...obj1.foo, bar: newValue2 } });
  });

  it("should set a value inside an object that doesn't exist", () => {
    const newValue1 = { bar: { baz: 'hello' } };
    const result1 = set(obj2, proxy => proxy.foo, newValue1);

    expect(result1).not.toBe(obj2);
    expect(result1.foo).not.toBe(obj2.foo);

    expect(result1.a).toBe(obj2.a);
    expect(result1.a.b).toBe(obj2.a.b);

    expect(result1).toEqual({ ...obj2, foo: newValue1 });

    const newValue2 = { baz: 'hello again' };
    const result2 = set(obj2, proxy => proxy.foo.bar, newValue2);

    expect(result2).not.toBe(obj2);
    expect(result2.foo).not.toBe(obj2.foo);

    expect(result2.a).toBe(obj2.a);
    expect(result2.a.b).toBe(obj2.a.b);

    expect(result2).toEqual({ ...obj2, foo: { ...obj2.foo, bar: newValue2 } });
  });
});
