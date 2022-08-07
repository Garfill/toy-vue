import { h } from '../lib/esm/toy-vue.esm.js'

window.app = null;

export const App = {
  render() {
    window.self = this
    return h(
      'div',
      {
        id: 'root',
        onClick() {
          console.log('click')
        }
      },
      this.msg
      // [
      //   h('div', {}, 'hello'),
      //   h('div', {}, 'toy-vue')
      // ]
    )
  },
  setup() {
    return {
      msg: 'hello toy-vue'
    }
  }
}