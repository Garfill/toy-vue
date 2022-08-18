import { h, ref } from '../../lib/esm/toy-vue.esm.js'

export const App = {
  name: 'App',
  setup() {
    let count = ref(0)
    const addCount = () => {
      count.value++
    }

    const props =ref({
      foo: 'foo',
      bar: 'bar',
    })
    const onChange1 = () => {
      props.value.foo = 'newfoo'
    }
    const onChange2 = () => {
      props.value.bar = undefined
    }
    const onChange3 = () => {
      props.value = {
        zoo: 'zoo'
      }
    }


    return {
      count,
      addCount,
      props,
      onChange1,
      onChange2,
      onChange3,
    }
  },
  render() {
    return h('div', { ...this.props }, [
      h('div', { class: 'buttons' }, [
        h('button', { onClick: this.onChange1 }, 'change foo'),
        h('button', { onClick: this.onChange2 }, 'remove bar'),
        h('button', { onClick: this.onChange3 }, 'set props'),
      ])
    ])
  }
}