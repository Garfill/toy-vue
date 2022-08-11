import { creaetVnode, Fragment } from "../vnode"

export function renderSlot(slots, name: string, props = {}) {
  let slot = slots[name]
  if (slot) {
    const slotContent = slot(props)
    return creaetVnode(Fragment, {}, slotContent)
  }
}
