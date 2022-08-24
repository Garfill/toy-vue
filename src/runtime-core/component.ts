import { proxyRefs } from "../reactive";
import { shallowReadonly } from "../reactive/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode, parent) {
  const instance = {
    vnode,
    next: null, // 待更新的vnode
    type: vnode.type,
    setupState: {},
    proxy: null,
    props: Object.create(null),
    emit: () => {},
    slots: Object.create(null),
    parent,
    provides: parent ? parent.provides : {},
    isMounted: false, // 标识组件是否已挂载
    subTree: null, // 存储组件节点树
    update: null, // 组件effect返回的更新函数
  }

  instance.emit = emit.bind(null, instance) as any
  
  return instance
}

export function setupComponent(instance) {
  const { props, children } = instance.vnode
  initProps(instance, props)
  initSlots(instance, children)

  setupStatefulComponent(instance)
  
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type; // 构建组件传入的配置对象

  // 代理this取值
  instance.proxy = new Proxy({_: instance}, PublicInstanceProxyHandlers)

  const { setup } = Component
  if (setup) {
    setCurrentInstance(instance)
    const setupResult = setup(shallowReadonly(instance.props), { emit: instance.emit })
    handleSetupResult(instance, setupResult)
    setCurrentInstance(null)
  } else {
    finishComponentSetup(instance)
  }
}

function handleSetupResult(instance, setupResult: any) {
  if (typeof setupResult === 'object') {
    instance.setupState = proxyRefs(setupResult)
  }
  
  finishComponentSetup(instance) // 保证render不为空
}

function finishComponentSetup(instance: any) {
  const Component = instance.type
  if (Component.render) {
    instance.render = Component.render; // 优先选择配置对象内的render函数
  }
}


let currentInstance = null;
function setCurrentInstance(instance) {
  currentInstance = instance
}
export function getCurrentInstance() {
  return currentInstance
}

