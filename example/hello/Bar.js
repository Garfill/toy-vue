import { h, renderSlot, createTextVNode, inject } from '../../lib/esm/toy-vue.esm.js'

export const Bar = {
  name: 'bar',
  setup() {
    const msg = inject('provideMsg')
    return { msg }
  },
  render() {
    return h('div', { class: 'bar' }, [
      renderSlot(this.$slots, 'header'),
      createTextVNode(this.msg),
      renderSlot(this.$slots, 'footer', { age: 28 })
    ])
  },
}