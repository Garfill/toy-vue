import { h, ref } from '../../lib/esm/toy-vue.esm.js'
export const ArrayToText = {
  setup() {
    const isChange = ref(false)
    const toggle = () => {
      isChange.value = !isChange.value
    }
    return {
      isChange,
      toggle
    }
  },
  render() {
    return h('div', { class: 'array-to-text', onClick: this.toggle }, 
      this.isChange ? [h('div', {}, 'array'), h('div', {}, 'text')] : 'array to text'
    )
  }
}