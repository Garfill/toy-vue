/**
 * 创建虚拟节点
 * @param type component配置对象
 * @param props 
 * @param children 
 * @returns vnode
 */
export function creaetVnode(type, props?, children?) {
  let vnode = {
    type,
    props,
    children,
  }

  return vnode
}