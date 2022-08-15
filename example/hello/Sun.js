import { h, inject } from '../../lib/esm/toy-vue.esm.js'

export const Sun = {
  name: 'sun',
  setup() {
    const grand = inject('provideMsg')
    const notPromvidedMsg = inject('foobar',  () => 'no found that msg')
    return {
      grand,
      notPromvidedMsg,
    }
  },
  render() {
    return h('div',{ class: 'sun' }, [
      h('div', { class: 'found' }, this.grand),
      h('div', { class: 'not-found' }, this.notPromvidedMsg),
    ])
  }
}