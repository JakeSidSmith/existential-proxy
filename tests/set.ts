import * as ep from '../src';

describe('set', () => {
  interface FooBar {
    foo?: {
      bar: {
        baz: string;
      } | null;
    };
    a: {
      b: string;
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

  type Arr = ReadonlyArray<ReadonlyArray<string | undefined> | undefined>;

  const arr1: Arr = [['foo']];

  const arr2: Arr = [];

  interface NumKey {
    a?: {
      0: {
        b: {
          0: string;
          1: string;
        } | null;
      };
    };
  }

  const numKey1: NumKey = {};

  const numKey2: NumKey = {
    a: {
      0: {
        b: null,
      },
    },
  };

  it('replaces the initial object', () => {
    const newValue1 = {};
    const result1 = ep.set(obj1, proxy => proxy, newValue1);

    expect(result1).not.toBe(obj1);
    expect(result1).toBe(newValue1);

    const newValue2 = [['hello']];
    const result2 = ep.set(arr1, proxy => proxy, newValue2);

    expect(result2).not.toBe(arr1);
    expect(result2).toBe(newValue2);
  });

  it('sets override a value inside an object that already exists', () => {
    const newValue1 = { bar: { baz: 'hello' } };
    const result1 = ep.set(obj1, proxy => proxy.foo, newValue1);

    expect(result1).not.toBe(obj1);
    expect(result1.foo).not.toBe(obj1.foo);

    expect(result1.a).toBe(obj1.a);
    expect(result1.a.b).toBe(obj1.a.b);

    expect(result1).toEqual({ ...obj1, foo: newValue1 });

    const newValue2 = { baz: 'hello again' };
    const result2 = ep.set(obj1, proxy => proxy.foo.bar, newValue2);

    expect(result2).not.toBe(obj1);
    expect(result2.foo).not.toBe(obj1.foo);
    expect(result2.foo!.bar).not.toBe(obj1.foo!.bar);

    expect(result2.a).toBe(obj1.a);
    expect(result2.a.b).toBe(obj1.a.b);

    expect(result2).toEqual({ ...obj1, foo: { ...obj1.foo, bar: newValue2 } });

    const newValue3 = ['hello'];
    const result3 = ep.set(arr1, proxy => proxy[0], newValue3);

    expect(result3).not.toBe(arr1);
    expect(result3[0]).toBe(newValue3);
    expect(result3).toEqual([newValue3]);

    const newValue4 = 'hello again';
    const result4 = ep.set(arr1, proxy => proxy[0][0], newValue4);

    expect(result4).not.toBe(arr1);
    expect(result4[0]![0]).toBe(newValue4);
    expect(result4).toEqual([[newValue4]]);
  });

  it("should set a value inside an object that doesn't exist", () => {
    const newValue1 = { bar: { baz: 'hello' } };
    const result1 = ep.set(obj2, proxy => proxy.foo, newValue1);

    expect(result1).not.toBe(obj2);
    expect(result1.foo).not.toBe(obj2.foo);

    expect(result1.a).toBe(obj2.a);
    expect(result1.a.b).toBe(obj2.a.b);

    expect(result1).toEqual({ ...obj2, foo: newValue1 });

    const newValue2 = { baz: 'hello again' };
    const result2 = ep.set(obj2, proxy => proxy.foo.bar, newValue2);

    expect(result2).not.toBe(obj2);
    expect(result2.foo).not.toBe(obj2.foo);

    expect(result2.a).toBe(obj2.a);
    expect(result2.a.b).toBe(obj2.a.b);

    expect(result2).toEqual({ ...obj2, foo: { ...obj2.foo, bar: newValue2 } });

    const newValue3 = ['hello'];
    const result3 = ep.set(arr2, proxy => proxy[0], newValue3);

    expect(result3).not.toBe(arr2);
    expect(result3[0]).toBe(newValue3);
    expect(result3).toEqual([newValue3]);

    const newValue4 = 'hello again';
    const result4 = ep.set(arr2, proxy => proxy[0][0], newValue4);

    expect(result4).not.toBe(arr2);
    expect(result4[0]![0]).toBe(newValue4);
    expect(result4).toEqual([[newValue4]]);
  });

  it('should create an arrays for keys that when parsed to numbers are finite', () => {
    const result1 = ep.set(numKey1, proxy => proxy.a[0].b[0], 'hello');

    expect(result1).toEqual({ a: [{ b: ['hello'] }] });

    const result2 = ep.set(numKey1, proxy => proxy.a[0].b[1], 'hello');

    expect(result2).toEqual({ a: [{ b: [undefined, 'hello'] }] });

    const result3 = ep.set(numKey2, proxy => proxy.a[0].b[0], 'hello');

    expect(result3).toEqual({ a: { 0: { b: ['hello'] } } });

    const result4 = ep.set(numKey2, proxy => proxy.a[0].b[1], 'hello');

    expect(result4).toEqual({ a: { 0: { b: [undefined, 'hello'] } } });
  });
});
