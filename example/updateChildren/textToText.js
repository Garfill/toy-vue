import { h, ref } from '../../lib/esm/toy-vue.esm.js'
export const TextToText = {
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
    return h('div', { class: 'text-to-array', onClick: this.toggle },
      this.isChange ? 'this is change' : 'this is not change'
    )
  }
}