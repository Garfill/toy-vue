import { getShapeFlag, ShapeFlags } from "../../shapeFlags"
import { isArray, isObject, isStringOrNum } from "../share/index"


export const Fragment = Symbol('Fragment')
export const Text = Symbol('Text')
/**
 * 创建虚拟节点
 * @param type component配置对象
 * @param props 
 * @param children 
 * @returns vnode
 */
export { creaetVnode as createElementVNode }
export function creaetVnode(type, props?, children?) {
  let vnode: any = {
    type,
    props,
    children,
    el: null,
    component: null,
    key: props?.key,
    shapeFlag: getShapeFlag(type),
  }

  if (isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else if (isStringOrNum(children)) {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }

  normalizeChildren(vnode)

  return vnode
}

function normalizeChildren(vnode) {
  if (isObject(vnode.children)) {
    if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      // 有设置 slot 的组件vnode
      vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
    }
  }
}

export function createTextVNode(text: string) {
  return creaetVnode(Text, {}, text)
}