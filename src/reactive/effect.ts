import { extend } from "../share";

interface EffectFn {
  (): any
}

class ReactiveEffect {
  private _fn: EffectFn;
  public scheduler: any;
  public deps; // 里面存储项是 Set 类型
  private active: boolean; // 当前是否激活，防止stop多次执行
  private onStop?: () => void;
  constructor(fn: EffectFn, scheduler?: any) {
    this._fn = fn;
    this.scheduler = scheduler;
    this.deps = [];
    this.active = true;
  }
  run() {
    activeEffect = this
    return this._fn()
  }
  addDep(dep) {
    this.deps.push(dep)
  }
  stop() {
    if (this.active) {
      cleanupEffect(this)
      if (this.onStop) {
        this.onStop()
      }
      this.active = false;
    }
  }
}

/**
 * 从keyDep的Set中删除特定的effect
 * @param effect ReactiveEffect
 */
function cleanupEffect(effect: any) {
  effect.deps.forEach(dep => {
    dep.delete(effect)
  });
}

// 当前激活的 effect
let activeEffect: ReactiveEffect

// 响应式数据的map容器
// targetMap: { target : Map{ key: Set }}
// Set 是依赖收集的set
let targetMap = new Map()

/**
 * 收集依赖
 * target对象中的属性key的依赖
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

  if (!activeEffect) return; // 单纯的读取reactive值的时候没有activeEffect, 之后再effect过程中才会生成
  keyDep.add(activeEffect)
  activeEffect.addDep(keyDep)
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
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

export function effect(fn: EffectFn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options)
  _effect.run()
  // 返回runner，手动触发effect
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect

  return runner
}


export function stop(runner) {
  runner.effect.stop()
}