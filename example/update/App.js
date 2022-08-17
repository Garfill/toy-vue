import { h, ref } from '../../lib/esm/toy-vue.esm.js'

export const App = {
  name: 'App',
  setup() {
    let count = ref(0)
    const addCount = () => {
      console.log('click')
      console.log(count.value)
      count.value++
    }
    return {
      count,
      addCount,
    }
  },
  render() {
    return h('div', {}, [
      h('button', {
        onClick: this.addCount
      }, 'count ' +  this.count)
    ])
  }
}