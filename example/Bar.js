import { h, renderSlot } from '../lib/esm/toy-vue.esm.js'

export const Bar = {
  name: 'bar',
  render() {
    return h('div', { class: 'foo' }, [
      renderSlot(this.$slots, 'header'),
      renderSlot(this.$slots, 'footer', { age: 28 })
    ])
  }
}