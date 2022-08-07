import { h } from '../lib/esm/toy-vue.esm.js'
export const Foo = {
  name: "foo",
  render() {
    return h('div', {}, this.count)
  },
  setup(props) {
    console.log(props)
  }
}


// props功能
// 1. setup中获取 vnode 中的props
// 2. render中通过this获取
// 3. props的浅层属性不可以修改