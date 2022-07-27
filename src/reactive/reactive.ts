import { readonlyHandler, shareProxyHandler } from "./shareHandler";

type RawType = object | Array<any>;

export function reactive(raw: RawType) {
  const p = createReactiveObject(raw, shareProxyHandler)
  return p
}


export function readonly(raw: RawType) {
  const p = createReactiveObject(raw, readonlyHandler)
  return p
}


function createReactiveObject(target, handlerObject) {
  // 返回proxy拦截对象的get和set
  return new Proxy(target, handlerObject)
}