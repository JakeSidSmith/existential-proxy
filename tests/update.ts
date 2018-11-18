import * as ep from '../src';

describe('update', () => {
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

  it('replaces the initial object', () => {
    const newValue1 = {};
    const result1 = ep.update(obj1, proxy => proxy, () => newValue1);

    expect(result1).not.toBe(obj1);
    expect(result1).toBe(newValue1);

    const newValue2 = [['hello']];
    const result2 = ep.update(arr1, proxy => proxy, () => newValue2);

    expect(result2).not.toBe(arr1);
    expect(result2).toBe(newValue2);
  });

  it('sets override a value inside an object that already exists', () => {
    const newValue1 = { bar: { baz: 'hello' } };
    const result1 = ep.update(obj1, proxy => proxy.foo, () => newValue1);

    expect(result1).not.toBe(obj1);
    expect(result1.foo).not.toBe(obj1.foo);

    expect(result1.a).toBe(obj1.a);
    expect(result1.a.b).toBe(obj1.a.b);

    expect(result1).toEqual({ ...obj1, foo: newValue1 });

    const newValue2 = { baz: 'hello again' };
    const result2 = ep.update(obj1, proxy => proxy.foo.bar, () => newValue2);

    expect(result2).not.toBe(obj1);
    expect(result2.foo).not.toBe(obj1.foo);
    expect(result2.foo!.bar).not.toBe(obj1.foo!.bar);

    expect(result2.a).toBe(obj1.a);
    expect(result2.a.b).toBe(obj1.a.b);

    expect(result2).toEqual({ ...obj1, foo: { ...obj1.foo, bar: newValue2 } });

    const newValue3 = ['hello'];
    const result3 = ep.update(arr1, proxy => proxy[0], () => newValue3);

    expect(result3).not.toBe(arr1);
    expect(result3[0]).toBe(newValue3);
    expect(result3).toEqual([newValue3]);

    const newValue4 = 'hello again';
    const result4 = ep.update(arr1, proxy => proxy[0][0], () => newValue4);

    expect(result4).not.toBe(arr1);
    expect(result4[0]![0]).toBe(newValue4);
    expect(result4).toEqual([[newValue4]]);
  });

  it("should set a value inside an object that doesn't exist", () => {
    const newValue1 = { bar: { baz: 'hello' } };
    const result1 = ep.update(obj2, proxy => proxy.foo, () => newValue1);

    expect(result1).not.toBe(obj2);
    expect(result1.foo).not.toBe(obj2.foo);

    expect(result1.a).toBe(obj2.a);
    expect(result1.a.b).toBe(obj2.a.b);

    expect(result1).toEqual({ ...obj2, foo: newValue1 });

    const newValue2 = { baz: 'hello again' };
    const result2 = ep.update(obj2, proxy => proxy.foo.bar, () => newValue2);

    expect(result2).not.toBe(obj2);
    expect(result2.foo).not.toBe(obj2.foo);

    expect(result2.a).toBe(obj2.a);
    expect(result2.a.b).toBe(obj2.a.b);

    expect(result2).toEqual({ ...obj2, foo: { ...obj2.foo, bar: newValue2 } });

    const newValue3 = ['hello'];
    const result3 = ep.update(arr2, proxy => proxy[0], () => newValue3);

    expect(result3).not.toBe(arr2);
    expect(result3[0]).toBe(newValue3);
    expect(result3).toEqual([newValue3]);

    const newValue4 = 'hello again';
    const result4 = ep.update(arr2, proxy => proxy[0][0], () => newValue4);

    expect(result4).not.toBe(arr2);
    expect(result4[0]![0]).toBe(newValue4);
    expect(result4).toEqual([[newValue4]]);
  });

  it('should ignore mutations to the original value', () => {
    const toMutate: FooBar = {
      foo: {
        bar: {
          baz: 'baz',
        },
      },
      a: {
        b: 'b',
      },
    };

    const newValue1 = { bar: { baz: 'hello' } };
    const result1 = ep.update(
      toMutate,
      proxy => proxy.foo,
      foo => {
        if (foo) {
          foo.bar = null;
        }

        return newValue1;
      }
    );

    expect(result1).toEqual({ ...obj1, foo: newValue1 });
  });

  it('should allow mapping on existing arrays', () => {
    const arr: Arr = [['hello']];
    const result1 = ep.update(
      arr,
      proxy => proxy[0],
      value => {
        if (value) {
          return value.map(item =>
            typeof item === 'string' ? `${item} mapped` : item
          );
        }

        return [];
      }
    );

    expect(result1).toEqual([['hello mapped']]);
  });
});
