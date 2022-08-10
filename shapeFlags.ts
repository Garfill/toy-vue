import { isObject, isString } from "./src/share/index";

export const enum ShapeFlags {
  ELEMENT = 1,
  STATEFUL_COMPONENT = 1 << 1,
  TEXT_CHILDREN = 1 << 2,
  ARRAY_CHILDREN = 1 << 3,
  SLOT_CHILDREN = 1 << 4,
}

export function getShapeFlag(value) {
  if (isObject(value)) {
    return ShapeFlags.STATEFUL_COMPONENT
  } else if(isString(value)) {
    return ShapeFlags.ELEMENT
  }
}