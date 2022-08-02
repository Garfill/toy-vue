import { creaetVnode } from './vnode'

export function h(type, props?, children?) {
  return creaetVnode(type, props, children)
}