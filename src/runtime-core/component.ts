import { shallowReadonly } from "../reactive/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: Object.create(null),
    emit: () => {},
  }

  instance.emit = emit.bind(null, instance) as any
  
  return instance
}

export function setupComponent(instance) {
  // todo
  const { props } = instance.vnode
  initProps(instance, props)
  // initSlots()

  setupStatefulComponent(instance)
  
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type; // 构建组件传入的配置对象

  // 代理this取值
  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers)

  const { setup } = Component
  if (setup) {
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }
  
  finishComponentSetup(instance) // 保证render不为空
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  if (Component.render) {
    instance.render = Component.render; // 优先选择配置对象内的render函数
  }
}

