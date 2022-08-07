import { h } from '../lib/esm/toy-vue.esm.js'
import { Foo } from './Foo.js';

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
      [h(Foo, { count: 0 })]
    )
  },
  setup() {
    return {
      msg: 'hello toy-vue'
    }
  }
}