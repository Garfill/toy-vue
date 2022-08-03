import { h } from '../lib/esm/toy-vue.esm.js'
export const App = {
  render() {
    return h('div', { id: 'root' }, [
      h('div', {}, 'hello'),
      h('div', {}, 'toy-vue')
    ])
  },
  setup() {
    return {
      msg: 'hello toy-vue'
    }
  }
}