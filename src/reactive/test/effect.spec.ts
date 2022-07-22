import { effect } from '../effect'
import { reactive } from '../reactive'
describe('happy path', () => {
  it('effect', () => {
    let next = 0;
    let obj = reactive({ foo: 1 });
    effect(() => {
      next = obj.foo + 1
    })
    expect(next).toBe(2)

    obj.foo = obj.foo + 1
    expect(next).toBe(3)
  });
});