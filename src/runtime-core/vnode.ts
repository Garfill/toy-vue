import { getShapeFlag, ShapeFlags } from "../../shapeFlags"
import { isArray, isString } from "../share/index"

/**
 * 创建虚拟节点
 * @param type component配置对象
 * @param props 
 * @param children 
 * @returns vnode
 */
export function creaetVnode(type, props?, children?) {
  let vnode: any = {
    type,
    props,
    children,
    el: null,
    shapeFlag: getShapeFlag(type),
  }

  if (isArray(children)) {
    vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
  } else if (isString(children)) {
    vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
  }

  return vnode
}