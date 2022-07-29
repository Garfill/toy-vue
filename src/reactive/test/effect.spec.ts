import { effect, recover, stop } from '../effect'
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

    expect(scheduler).not.toBeCalled()
    expect(dummy).toBe(2);

    obj.foo++
    expect(scheduler).toBeCalledTimes(1)
    expect(dummy).toBe(2)

    run()
    expect(dummy).toBe(3)
  });

  it('stop', () => {
    let dummy;
    const obj = reactive({ foo: 1 })
    const runner = effect(() => {
      dummy = obj.foo + 1
    })
    obj.foo = 2
    expect(dummy).toBe(3)

    stop(runner)
    // obj.foo = 3
    // obj.foo++ -> obj.foo = obj.foo + 1 -> 先触发了set，收集了依赖，导致上面stop失效
    obj.foo++
    expect(dummy).toBe(3)

    // stop之后，keyDep的Set里就没有对应的activeEffect，只有通过runner执行来改变值
    runner()
    expect(dummy).toBe(4)


    obj.foo = 0
    recover(runner)
    expect(dummy).toBe(1);
    obj.foo = 10
    expect(dummy).toBe(11);
  });

  it('onStop', () => {
    const obj = reactive({ foo: 1 })
    let count = 0
    const onStop = jest.fn(() => {
      count++
    })
    let dummy = 0;
    const runner = effect(() => {
      dummy = obj.foo + 1;
    }, { onStop })

    stop(runner)
    expect(onStop).toBeCalledTimes(1)
    expect(count).toBe(1)
  });
});