import { isReadonly, shallowReadonly } from "../reactive";

describe('shallow readonly', () => {
  it('should not make non-reactive properties properties', () => {
    let origin = {
      n: { foo: 1 },
      jazz: {
        niu: {
          bi: 2
        }
      }
    }
    const shallow: any = shallowReadonly(origin)
    expect(isReadonly(shallow)).toBe(true)
    expect(isReadonly(shallow.n)).toBe(false)
    expect(isReadonly(shallow.jazz.niu)).toBe(false)
  });

  it('read only', () => {
    console.warn = jest.fn()
    const user: any = shallowReadonly({ age: 10 })
    user.age++
    expect(console.warn).toBeCalledTimes(1)
    expect(user.age).toBe(10)
  })

});