import { hasChange } from "../share";
import { ReactiveEffect } from "../reactive/effect";
import { isReactive } from "../reactive/reactive";
import { isRef } from "../reactive/ref"
import { queuePreFlushQueue } from "./scheduler";

export function watch(source, cb) {
  let getter = () => { };
  let oldVal;

  if (isRef(source)) {
    getter = () => source.value;
  } else if (isReactive(source)) {
    getter = () => source
  }

  let scheduler = () => {
    if (!effect.active) {
      return;
    }
    if (cb) {
      const newVal = effect.run()
      if (hasChange(oldVal, newVal)) {
        cb(oldVal, newVal)
        oldVal = newVal
      }
    }
  }

  let effect = new ReactiveEffect(getter, { scheduler })



  // 初始化获取原始值
  oldVal = effect.run()
}


export function watchEffect(fn) {
  function job() {
    effect.run()
  }

  let cleanup
  let onCleanup = (cleanupFn) => {
    cleanup = effect.onStop = cleanupFn
  } 
  

  const getter = () => {
    if (cleanup) {
      cleanup()
    }
    fn(onCleanup)
  }
  
  const effect = new ReactiveEffect(getter, {
    scheduler() {
      queuePreFlushQueue(job)
    }
  })

  effect.run()

  return () => {
    effect.stop()
  }
}