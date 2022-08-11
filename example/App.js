import { h, createTextVNode } from '../lib/esm/toy-vue.esm.js'
import { Bar } from './Bar.js';
import { Foo } from './Foo.js';

window.app = null;

export const App = {
  render() {
    return h(
      'div',
      {
        id: 'root',
      },
      [
        h(Foo, {
          count: 0,
          onClick(a, b, c) {
            console.log('onClick')
            console.log(a, b, c)
          },
        }),
        h(Bar, {}, {
          header: () => h('div', { class: 'header' }, [createTextVNode('header')]),
          footer: ({age}) => h('span', { class: 'footer' }, 'footer is ' + age)
        })
      ]
    )
  },
  setup() {
    return {
      msg: 'hello toy-vue'
    }
  }
}