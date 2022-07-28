import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  getter: any;
  private _dirty: boolean = true;
  private _value;
  private _effect: any;
  constructor(getter) {
    this.getter = getter
    this._effect = new ReactiveEffect(
      getter,
      this.setDirty.bind(this),
      // 绑定this，不绑定会指向_effect
    )
  }
  get value () {
    if (this._dirty) {
      this._value = this._effect.run()
      this._dirty = false
    }
    return this._value
  }
  setDirty() {
    this._dirty = true;
  }
}

function createComputedRef(getter) {
  return new ComputedRefImpl(getter)
}
export function computed(getter): any {
  return createComputedRef(getter)
}