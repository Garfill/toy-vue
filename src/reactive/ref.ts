import { hasChange, isObject } from "../share";
import { isTracking, notifyEffect, trackEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _rawValue: any;
  private _dep: Set<unknown>;
  private _value: boolean;
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

