import { extend, isObject } from "../share";
import { notify, track } from "./effect";
import { reactive, readonly, VUE_REACTIVE_FLAG } from "./reactive";

function createGetter(isReadonly = false, shallow = false) {
  return function (target, key) {
    // isReactive/isReadonly 的特殊处理
    if (key === VUE_REACTIVE_FLAG.IS_REACTIVE) {
      return !isReadonly
    } else if (key === VUE_REACTIVE_FLAG.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)
    if (shallow) {
      // 浅层的，只会对最外层的属性初始化响应式
      // 里层的属性，拿到就直接返回
      return res
    }
    // 嵌套的数据对象，初始化响应式
    if (isObject(res)) {
      // 这里可以说是延迟进行响应式初始化
      // 只有读取的时候才会进行初始化响应式
      return isReadonly ? readonly(res) : reactive(res)
    }

    if (!isReadonly) {
      track(target, key)
    }
    return res;
  }
}
function createSetter() {
  return function (target, key, value) {
    const res = Reflect.set(target, key, value);
    // 触发依赖
    notify(target, key)
    return res;
  }
}


// 提前执行生成getter和setter，以后的handler对象共享同一个getter和setter
const cacheGetter = createGetter()
const cacheSetter = createSetter()
export const shareProxyHandler = {
  get: cacheGetter,
  set: cacheSetter,
}



const cacheReadOnlyGetter = createGetter(true)
export const readonlyHandler = {
  get: cacheReadOnlyGetter,
  set(obj, prop, value) {
    console.warn(`You cannot set ${prop} of a readonly Object `, obj)
    return true;
  }
}


const shallowReadonlyGetter = createGetter(true, true)
export const shallowReadonlyHandler = extend({}, readonlyHandler, {
  get: shallowReadonlyGetter
})