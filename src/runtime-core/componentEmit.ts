import { camelize, toHandlerKey } from "../share/index"

export function emit(instance, event, ...args) {
  let eventName = toHandlerKey(camelize(event))
  let handler = instance.props[eventName]
  handler && handler(...args)
}