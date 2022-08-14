import { getCurrentInstance } from "./component";

export function provide(key, value) {
  const currentInstance: any = getCurrentInstance()
  if (currentInstance) {
    let { provides } = currentInstance
    // 如果当前组件不使用provide，就可以直接引用父级组件的provides（生成componentInstance的时候进行初始化）
    // 当前组件有使用provide，就要重新创建一个对象，并以父组件的provides为原型

    let parentProvides = currentInstance.parent?.provides
    if (provides === parentProvides) {
      // 未设置，仅仅是初始化的引用
      provides = currentInstance.provides = Object.create(parentProvides)
    }
    provides[key] = value
  }
}

export function inject(key, defaultValue) {
  const currentInstance: any = getCurrentInstance();
  if (currentInstance) {
    let { provides } = currentInstance.parent

    if (key in provides) {
      return provides[key]
    } else if (defaultValue){
      if (typeof defaultValue === 'function') {
        defaultValue = defaultValue()
      }
      return defaultValue
    }
  }
}