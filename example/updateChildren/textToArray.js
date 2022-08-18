import { h, ref } from '../../lib/esm/toy-vue.esm.js'
export const TextToArray = {
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
      this.isChange ? 'array to text' : [h('div', {}, 'array'), h('div', {}, 'text')]
    )
  }
}