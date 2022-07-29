import { render } from "./renderer"
import { creaetVnode } from "./vnode"

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // 先转换成虚拟节点vnode，再挂载到页面
      // 后续操作都基于vnode，在patch到页面
      const vnode = creaetVnode(rootComponent)
      render(vnode, rootContainer)
    }
  }
}