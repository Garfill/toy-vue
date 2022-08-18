import { h } from '../../lib/esm/toy-vue.esm.js'
import { ArrayToText } from './arrayToText.js'
import { TextToText } from './textToText.js'
import { TextToArray } from './textToArray.js'


export const App = {
  render() {
    return h('div', { class: 'app'}, [
      h(ArrayToText),
      h(TextToText),
      h(TextToArray),
    ])
  }
}