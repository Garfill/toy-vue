import { h, renderSlot, createTextVNode } from '../lib/esm/toy-vue.esm.js'

export const Bar = {
  name: 'bar',
  render() {
    return h('div', { class: 'bar' }, [
      renderSlot(this.$slots, 'header'),
      createTextVNode('123'),
      renderSlot(this.$slots, 'footer', { age: 28 })
    ])
  }
}