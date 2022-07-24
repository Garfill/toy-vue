interface EffectFn {
  (): any
}

class ReactiveEffect {
  private _fn: EffectFn
  constructor(fn: EffectFn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this
    return this._fn()
  }
}

// 当前激活的 effect
let activeEffect: ReactiveEffect

// 响应式数据的map
// targetMap: { target : Map{ key: Set }}
// Set 是依赖收集的set
let targetMap = new Map()

/**
 * 收集依赖target对象中的属性key的依赖
 * @param target 响应式对象
 * @param key 属性
 */
export function track(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let keyDep = depsMap.get(key)
  if (!keyDep) {
    keyDep = new Set()
    depsMap.set(key, keyDep)
  }
  keyDep.add(activeEffect)
}

/**
 * 属性key的值更新，通知依赖触发
 * @param target 响应式对象
 * @param key 属性
 */
export function notify(target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)
  // dep 就是 track 中收集到的所有 effect
  for (const effect of dep) {
    effect.run()
  }
}

export function effect(fn: EffectFn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
  // 返回runner，手动触发effect
  return _effect.run.bind(_effect)
}