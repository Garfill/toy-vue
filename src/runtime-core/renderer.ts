import { createComponentInstance, setupComponent } from "./component"

/**
 * 
 * @param vnode 虚拟节点
 * @param container 组件容器元素
 */
export function render(vnode, container) {
  // patch
  patch(vnode, container)
}

function patch(vnode, container) {
  // 处理组件或者element 的 patch

  // 处理组件类型
  processComponent(vnode, container)
}

function processComponent(vnode: any, container: any) {
  mountComponent(vnode, container)
}

function mountComponent(vnode: any, container: any) {
  const instance = createComponentInstance(vnode)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render(); // 虚拟节点树 vnode

  patch(subTree, container) // 处理完组件类型，生成组件内部的vnode，递归调用patch挂载subTree
}

