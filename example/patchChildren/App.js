import { h } from '../../lib/esm/toy-vue.esm.js'
import patchChildren from './patchChildren.js'

export const App = {
  render() {
    return h('div', { class: 'app'}, [
      h(patchChildren)
    ])
  }
}