import { hasChange } from "../share";
import { ReactiveEffect } from "./effect";
import { isReactive } from "./reactive";
import { isRef } from "./ref"

export function watch(source, cb) {
  let getter = () => {};
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

  let effect = new ReactiveEffect(getter, scheduler)



  // 初始化获取原始值
  oldVal = effect.run()
}