import { createApp } from '../../lib/esm/toy-vue.esm.js'
import App from './App.js'

let container = document.querySelector('#app')
createApp(App).mount(container)