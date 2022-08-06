const publicInstanceProxyMap = {
  $el: (i) => i.vnode.el
}

export const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key in instance.setupState) {
      return instance.setupState[key]
    }

    const publicInstanceProxyGetter = publicInstanceProxyMap[key]
    if (publicInstanceProxyGetter) {
      return publicInstanceProxyGetter(instance)
    }
  }
}