import { createRenderer } from "../runtime-core"
import { isOn } from "../share/index"

function createElement(type) {
  return document.createElement(type)
}

function patchProps(el, key, val) {
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase() // 取出事件名
    el.addEventListener(event, val)
  } else {
    el.setAttribute(key, val)
  }
}

function insert(el, parent) {
  parent.append(el)
}

const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert,
})

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from '../runtime-core'