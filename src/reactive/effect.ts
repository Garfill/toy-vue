import { extend } from "../share";

interface EffectFn {
  (): any
}

// 当前激活的 effect
let activeEffect: ReactiveEffect
// 当前是否处于可收集依赖的状态
let shouldTrack: boolean;

export class ReactiveEffect {
  private _fn: EffectFn;
  public options: any;
  public scheduler: any;
  public deps; // 里面存储项是 Set 类型
  public active: boolean; // 当前是否激活，防止stop多次执行
  public onStop?: () => void;
  constructor(fn: EffectFn, options?: any) {
    this._fn = fn;
    this.scheduler = options?.scheduler;
    this.deps = [];
    this.active = true;
  }
  run() {
    if (!this.active) {
      return this._fn()
    }

    shouldTrack = true // 打开收集依赖的开关
    activeEffect = this

    const result = this._fn();
    
    shouldTrack = false // effect的runner之后重新关闭开关，不进行收集
    return result;
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
  recover() {
    if (!this.active) {
      this.active = true;
      this.run()
    }
  }
}

/**
 * 从keyDep的Set中删除特定的effect
 * @param effect ReactiveEffect
 */
function  cleanupEffect(effect: any) {
  effect.deps.forEach(dep => {
    dep.delete(effect)
  });
  effect.deps.length = 0;
}

// 响应式数据的map容器
// targetMap: { target : Map{ key: Set }}
// Set 是依赖收集的set
let targetMap = new WeakMap()

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}
/**
 * 收集依赖
 * target对象中的属性key的依赖
 * @param target 响应式对象
 * @param key 属性
 */
export function track(target, key) {
  // if (!activeEffect) return; // 单纯的读取reactive值的时候没有activeEffect, 之后再effect过程中才会生成
  if (!isTracking()) return;

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
  trackEffect(keyDep)
}

export function trackEffect(dep) {
  if (dep.has(activeEffect)) return; // 防止重复收集
  dep.add(activeEffect)
  activeEffect.addDep(dep)
}


/**
 * 属性key的值更新，通知依赖触发
 * @param target 响应式对象
 * @param key 属性
 */
export function notify(target, key) {
  let depsMap = targetMap.get(target)
  if (!depsMap) return;
  let dep = depsMap.get(key)
  // dep 就是 track 中收集到的所有 effect
  if (dep) {
    notifyEffect(dep)
  }
}

export function notifyEffect(dep) {
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

export function recover(runner) {
  runner.effect.recover()
}