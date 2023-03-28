import { reactive } from "../reactive";
import { nextTick } from "../../runtime-core";
import { watchEffect } from "../../runtime-core/watch";
import { effect } from '../effect';


describe("watch", () => {
  it("effect", async () => {
    const state = reactive({count: 0})
    let dummy
    watchEffect(() => {
      dummy = state.count
    })
    expect(dummy).toBe(0)
    state.count++
    await nextTick()
    expect(dummy).toBe(1)
  })

  it('stop watching', async () => {
    const  state = reactive({ count: 0})
    let dummy
    const stop: any = watchEffect(() => {
      dummy = state.count
    })
    expect(dummy).toBe(0)

    stop()
    state.count++
    await nextTick()
    expect(dummy).toBe(0)
  })

  it("cleanup", async () => {
    const state = reactive({ count: 0 })
    let dummy
    let cleanup = jest.fn()

    const stop = watchEffect((onCleanup) => {
      onCleanup(cleanup)
      dummy = state.count
    })
    expect(dummy).toBe(0)
    
    state.count++
    await nextTick()
    expect(cleanup).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)

    stop()
    expect(cleanup).toHaveBeenCalledTimes(2)
  })
})