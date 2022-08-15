import { h, createTextVNode, provide } from '../../lib/esm/toy-vue.esm.js'
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
          footer: ({age}) => h('div', { class: 'footer' }, 'footer is ' + age)
        })
      ]
    )
  },
  setup() {
    provide('provideMsg', 'provideMsg from app')
    return {
      msg: 'hello toy-vue'
    }
  }
}