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