import { notify, track } from "./effect";

type RawType = object | Array<any>;


const shareProxyHandler = {
  get(obj, prop) {
    // 收集依赖
    track(obj, prop)
    const res = Reflect.get(obj, prop)
    return res;
  },
  set(obj, prop, value) {
    // 需要在重新set 之后再触发依赖，否则effect中run 里面会是旧值
    const res = Reflect.set(obj, prop, value);
    // 触发依赖
    notify(obj, prop)
    return res;
  }
}


export function reactive(raw: RawType) {
  // 返回proxy拦截对象的get和set
  const p = new Proxy(raw, shareProxyHandler)
  return p
}