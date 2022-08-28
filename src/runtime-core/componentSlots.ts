import { ShapeFlags } from "../../shapeFlags"
import { isArray, isStringOrNum } from "../share/index"

export function initSlots(instance, children) {
  // instance.$slots = children
  const { vnode } = instance
  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeSlotChildren(children, instance.slots)
  }
}

function normalizeSlotChildren(children, slots) {
  for (let key in children) {
    let slot = children[key]
    if (slot && typeof slot === 'function') {
      slots[key] = (props) => normalizeSlot(slot(props))
    }
  }
}

function normalizeSlot(slot) {
  return isArray(slot) ? slot : [slot]
}