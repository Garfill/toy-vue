import { ref, h, nextTick } from '../../lib/esm/toy-vue.esm.js'

export default {
  name: 'App',
  setup() {
    let count = ref(0)
    let changeCount = () => {
      // count.value++
      for (let i = 0; i < 100; i++) {
        count.value = i
      }
      nextTick(() => {
        let button = document.querySelector('.btn')
        console.log(button.textContent)
      })
    }
    return {
      count,
      changeCount
    }
  }, 
  render() {
    return h('button', { onClick: this.changeCount, class: 'btn' }, this.count)
  }
}