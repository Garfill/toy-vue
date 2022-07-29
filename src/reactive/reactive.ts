import { readonlyHandler, shallowReactiveHandler, shallowReadonlyHandler, shareProxyHandler } from "./shareHandler";

type RawType = object | Array<any>;

 export const enum VUE_REACTIVE_FLAG  {
  IS_REACTIVE = '_v_is_reactive',
  IS_READONLY = '_v_is_readonly',
}

export function reactive(raw: RawType) {
  const p = createReactiveObject(raw, shareProxyHandler)
  return p
}

export function shallowReactive(raw: RawType) {
  const p = createReactiveObject(raw, shallowReactiveHandler)
  return p
}


export function readonly(raw: RawType) {
  const p = createReactiveObject(raw, readonlyHandler)
  return p
}

export function shallowReadonly(raw: RawType) {
  const p = createReactiveObject(raw, shallowReadonlyHandler)
  return p
}


function createReactiveObject(target, handlerObject) {
  // 返回proxy拦截对象的get和set
  return new Proxy(target, handlerObject)
}


// 通过获取特定的key来标识数据类型
// key的获取会在getter做特殊处理
export function isReactive(target) {
  return !!target[VUE_REACTIVE_FLAG.IS_REACTIVE]
}
export function isReadonly(target) {
  return !!target[VUE_REACTIVE_FLAG.IS_READONLY]
}
export function isProxy(target) {
  // 也可以和上面一样用特定标识
  return isReactive(target) || isReadonly(target)
}