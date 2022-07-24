import { effect } from '../effect'
import { reactive } from '../reactive'
describe('happy path', () => {
  it('effect', () => {
    let next = 0;
    let obj = reactive({ foo: 1 });
    let runner = effect(() => {
      next = obj.foo + 1
      return 'foo'
    })
    expect(next).toBe(2)

    obj.foo = obj.foo + 1
    expect(next).toBe(3)

    obj.foo++
    // 调用runner 就是运行一次 effect 的 fn
    const r = runner()
    expect(r).toBe('foo')
    expect(next).toBe(4)
  });
});