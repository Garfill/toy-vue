export function createComponentInstance(vnode) {
  const instance = {
    vnode,
    type: vnode.type
  }

  return instance
}

export function setupComponent(instance) {
  // todo
  // initProps()
  // initSlots()

  setupStatefulComponent(instance)
  
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type; // 获取构建组件传入的配置对象
  const { setup } = Component

  if (setup) {
    const setupResult = setup()
    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult: any) {
  // todo 

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

