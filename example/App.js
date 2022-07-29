export const App = {
  render() {
    return h('h1', this.msg)
  },
  setup() {
    return {
      msg: 'hello toy-vue'
    }
  }
}