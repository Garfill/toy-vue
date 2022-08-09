import { h } from '../lib/esm/toy-vue.esm.js'
export const Foo = {
  name: "foo",
  render() {
    const button = h('button', {
      onClick: this.emitClick
    }, this.count)
    return h('div', {}, [button])
  },
  setup(props, { emit }) {
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