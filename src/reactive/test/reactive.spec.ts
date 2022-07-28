import { isProxy, isReactive, reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    let obj = reactive(original)
    expect(obj.foo).toBe(1)
  
    expect(isReactive(original)).toBe(false)
    expect(isReactive(obj)).toBe(true)

    expect(isProxy(obj)).toBe(true);
  });

  it('nested reactive', () => {
    const original = {
      nested: {
        foo: 1,
      },
      array: [{ bar: 2 }]
    }

    const observed = reactive(original)
    expect(isReactive(observed.nested)).toBe(true)
    expect(isReactive(observed.array)).toBe(true)
    expect(isReactive(observed.array[0])).toBe(true)
  });
});