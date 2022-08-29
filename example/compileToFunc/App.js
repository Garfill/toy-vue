import { ref } from '../../lib/esm/toy-vue.esm.js'

export const App = {
  template: `<div>hi, {{msg}}</div>`,
  setup() {
    const msg = window.msg = ref({'my': 'toy-vue'})
    return {
      msg
    }
  }
}