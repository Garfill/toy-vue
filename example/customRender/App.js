import { h } from '../../lib/esm/toy-vue.esm.js'

export const App = {
  name: 'App',
  render() {
    return h('rect', { x: this.x, y: this.y })
  },
  setup() {
    return {x: 100, y: 200}
  }
}