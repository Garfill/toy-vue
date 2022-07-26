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

  it('schedule', () => {
    let dummy: any;
    let run: any;
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo + 1;
    }, {
      scheduler
    })

    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(2);

    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(2)

    run()
    expect(dummy).toBe(3)
  });
});