import { hasChange, isObject } from "../share";
import { isTracking, notifyEffect, trackEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _rawValue: any;
  private _dep: Set<unknown>;
  private _value: any;
  public _v_is_ref = true;
  constructor(value) {
    this._rawValue = value
    this._value = convertToReactive(value)
    this._dep = new Set()
  }
  get value() {
    if (isTracking()) {
      trackEffect(this._dep)
    };
    return this._value
  }
  set value(newVal) {
    if (!hasChange(this._rawValue, newVal)) return
    // 切记！！修改完再通知effect
    this._rawValue = newVal
    this._value = convertToReactive(newVal)
    notifyEffect(this._dep)
  }
}

function convertToReactive(value) {
  return isObject(value) ? reactive(value) : value
}

export function ref(raw): any {
  return createRefImpl(raw)
}

function createRefImpl(value) {
  return new RefImpl(value)
}

export function isRef(ref) {
  return !!ref._v_is_ref
}

export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}

const refHandler = {
  get(target, key) {
    return unRef(Reflect.get(target, key))
  },
  set(target, key, value) {
    const oldValue = target[key]
    if (isRef(oldValue) && !isRef(value)) {
      // 原来的值是 ref，修改时候 target.key = value
      return (target[key].value = value)
    } else {
      // 原来的值不是ref
      return Reflect.set(target, key, value)
    }
  }
}

export function proxyRefs(target) {
  return new Proxy(target, refHandler)
}