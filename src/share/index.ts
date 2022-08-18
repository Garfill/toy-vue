export const extend = Object.assign

export function isObject(value) {
  return value !== null && typeof value === 'object'
}

export function hasChange(old, value) {
  return !Object.is(old, value)
}

export function isFunction(value: any)  {
  return typeof value === 'function'
}

export function isString(value) {
  return typeof value === 'string' || typeof value === 'number'
}

export function isArray(value) {
  return Array.isArray(value)
}

export function hasOwn(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key)
}

export function toHandlerKey(event: string) {
  return "on" + capitalize(event)
}

export function capitalize(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}


const camelizeRE = /-(\w)/g
export function camelize(string: string) {
  return string.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : ''))
}

export const isOn = (key: string) => /^on[A-Z]/.test(key)

export const EMPTY_OBJ = {}