import { notify, track } from "./effect";

function createGetter(isReadonly = false) {
  return function(target, key) {
    const res = Reflect.get(target, key)
    if (!isReadonly) {
      track(target, key)
    }
    return res;
  }
}
function createSetter() {
  return function(target, key, value) {
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

export const readonlyHandler = {
  get: createGetter(true),
  set(obj, prop, value) {
    console.warn(`You cannot set ${prop} of a readonly Object `, obj)
    return true;
  }
}