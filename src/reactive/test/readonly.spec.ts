import { isReadonly, readonly } from "../reactive";

describe('readonly', () => {
  it('happy path', () => {
    const original = { foo: 1, bar: { jaz: 2 }}
    const wrapped: any = readonly(original)
    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1)

    expect(isReadonly(original)).toBe(false)
    expect(isReadonly(wrapped)).toBe(true)
  });

  it('read only', () => {
    console.warn = jest.fn()
    const user: any = readonly({ age: 10 })
    user.age++
    expect(console.warn).toBeCalledTimes(1)
    expect(user.age).toBe(10)
  })
})