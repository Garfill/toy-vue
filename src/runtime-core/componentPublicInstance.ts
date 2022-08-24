import { hasOwn } from "../share/index"

const publicInstanceProxyMap = {
  $el: (i) => i.vnode.el,
  $slots: (i) => i.slots,
  $props: (i) => i.props,
}

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (hasOwn(instance.setupState, key)) {
      return instance.setupState[key]
    }
    if (hasOwn(instance.props, key)) {
      return instance.props[key]
    }

    const publicInstanceProxyGetter = publicInstanceProxyMap[key]
    if (publicInstanceProxyGetter) {
      return publicInstanceProxyGetter(instance)
    }
  }
}