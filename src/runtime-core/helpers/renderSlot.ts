import { creaetVnode } from "../vnode"

export function renderSlot(slots, name: string, props = {}) {
  let slot = slots[name]
  if (slot) {
    const slotContent = slot(props)
    console.log('slotContent', slotContent)
    return creaetVnode('div', { class: 'slot-container' }, slotContent)
  }
}
