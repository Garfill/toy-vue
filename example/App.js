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
      },
      [h(Foo, { 
          count: 0,
          onClick(a,b,c) {
            console.log('onClick')
            console.log(a, b, c)
          },
          onUpClick() {
            console.log('onUpClick')
          }
         })]
    )
  },
  setup() {
    return {
      msg: 'hello toy-vue'
    }
  }
}