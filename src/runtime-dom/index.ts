import { createRenderer } from "../runtime-core"
import { isOn } from "../share/index"

function createElement(type) {
  return document.createElement(type)
}

function patchProps(el, key, prevVal, nextVal) {
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase() // 取出事件名
    el.addEventListener(event, nextVal)
  } else {
    // 当新的props是 undefined/null ，直接删除属性
    if (nextVal === undefined || nextVal === null) {
      el.removeAttribute(key)
    } else {
      el.setAttribute(key, nextVal)
    }
  }
}

function insert(child, parent, anchor) {
  parent.insertBefore(child, anchor || null)
}

function remove(el) {
  const parent = el.parentNode;
  if (parent) {
    parent.removeChild(el)
  }
}

function setElementText(el: HTMLElement, text) {
  el.textContent =  text
}

const renderer: any = createRenderer({
  createElement,
  patchProps,
  insert,
  remove,
  setElementText,
})

export function createApp(...args) {
  return renderer.createApp(...args);
}

export * from '../runtime-core'