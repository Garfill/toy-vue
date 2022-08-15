import { h, provide } from '../../lib/esm/toy-vue.esm.js'
import { Sun } from './Sun.js'
export const Foo = {
  name: "foo",
  render() {
    const button = h('button', {
      onClick: this.emitClick
    }, this.count)
    const sun = h(Sun)
    return h('div', { class: 'foo' }, [
      button,
      sun,
    ])
  },
  setup(props, { emit }) {
    provide('provideMsg', 'provideMsg from foo')
    const emitClick = () => {
      emit('click', 1,2,3)
      emit('up-click')
    }
    return {
      emitClick,
    }
  }
}


// props功能
// 1. setup中获取 vnode 中的props
// 2. render中通过this获取
// 3. props的浅层属性不可以修改