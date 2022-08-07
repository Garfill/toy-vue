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