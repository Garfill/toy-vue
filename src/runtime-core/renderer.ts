import { ShapeFlags } from "../../shapeFlags"
import { effect } from "../reactive/effect"
import { EMPTY_OBJ } from "../share"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
  // 不同平台传入的渲染元素接口
  const {
    createElement: hostCreateElement, 
    patchProps: hostPatchProps, 
    insert: hostInsert,
    remove: hostRemove,
    setElementText: hostSetElementText
   } = options

  function render(vnode, container) {
    // patch
    patch(null, vnode, container, null, null)
  }

  /**
   * 
   * @param n1 旧vnode
   * @param n2 新vnode
   * @param container 
   * @param parentComponent 
   */
  function patch(n1, n2, container, parentComponent, anchor) {
    // 处理组件或者element 的 patch
    const { type, shapeFlag } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent, anchor)
        break;
      case Text:
        processText(n1, n2, container)
        break
      default:
        // 处理组件类型
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent, anchor)
        }
        break;
    }
  }

  function processComponent(n1, n2: any, container: any, parentComponent: any, anchor) {
    mountComponent(n2, container, parentComponent, anchor)
  }

  function mountComponent(vnode: any, container: any, parentComponent: any, anchor) {
    const instance = createComponentInstance(vnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, container, anchor)
  }

  function setupRenderEffect(instance, container, anchor) {
    effect(() => {
      // 通过 effect 将 数据和视图绑定

      if (!instance.isMounted) {
        // 未初始化
        const { proxy } = instance
        // 绑定render的this
        const subTree = instance.subTree = instance.render.call(proxy) // 虚拟节点树 vnode

        patch(null, subTree, container, instance, anchor) // 处理完组件类型，生成组件内部的vnode，递归调用patch挂载subTree

        // 当前组件Component在render完成之后
        instance.vnode.el = subTree.el
        instance.isMounted = true
      } else {
        const { proxy } = instance
        let prevSubTree = instance.subTree
        const subTree = instance.render.call(proxy) // 绑定render的this生成虚拟节点树 vnode
        instance.subTree = subTree // 更新组件的节点树
        patch(prevSubTree, subTree, container, instance, anchor) // 处理完组件类型，生成组件内部的vnode，递归调用patch挂载subTree


        // 当前组件Component在render完成之后
        // instance.vnode.el = subTree.el
      }
    })
  }

  function processElement(n1: any, n2: any, container: any, parentComponent, anchor) {
    if (!n1) {
      // n1 不存在，也就是null，初始化逻辑
      mountElement(n2, container, parentComponent, anchor)
    } else {
      patchElement(n1, n2, container, parentComponent, anchor)
    }
  }

  function mountElement(vnode: any, container: any, parentComponent, anchor) {
    // 创建节点
    // let el = document.createElement(vnode.type)
    let el = vnode.el = hostCreateElement(vnode.type)
    let { props, shapeFlag, children } = vnode
    // 子节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else {
      mountChildren(children, el, parentComponent, anchor)
    }
    // 添加 propsData

    // 事件监听函数和设置属性
    for (let key in props) {
      const val = props[key]
      hostPatchProps(el, key, null, val)
      // const isOn = (key: string) => /^on[A-Z]/.test(key)
      // if (isOn(key)) {
      //   const event = key.slice(2).toLowerCase() // 取出事件名
      //   el.addEventListener(event, val)
      // } else {
      //   el.setAttribute(key, val)
      // }
    }

    // 挂载
    // container.appendChild(el)
    hostInsert(el, container, anchor)
  }

  function patchElement(n1: any, n2: any, container: any, parentComponent, anchor) {
    //  更新props
    let oldProps = n1.props || EMPTY_OBJ
    let newProps = n2.props || EMPTY_OBJ
    let el = n2.el = n1.el
    patchProps(el, oldProps, newProps)

    // 更新子节点
    patchChilren(n1, n2, el, parentComponent, anchor)
  }

  function mountChildren(children, el, parentComponent, anchor) {
    children.forEach(v => {
      patch(null, v, el, parentComponent, anchor)
    });
  }

  function processFragment(n1, n2: any, container: any, parentComponent, anchor) {
    mountChildren(n2.children, container, parentComponent, anchor)
  }

  function processText(n1, n2: any, container: any) {
    let text = n2.el = document.createTextNode(n2.children)
    container.appendChild(text)
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) return; // 只有两个 props 不一样才进行patch

    for (let key in newProps) {
      const prevProp = oldProps[key]
      const nextProp = newProps[key]

      if (prevProp !== nextProp) {
        hostPatchProps(el, key, prevProp, nextProp)
      }
    }

    if (oldProps === EMPTY_OBJ) return; // 旧 props 为空，没必要循环

    for (let key in oldProps) {
      // 删除只有旧 props 上的属性
      if (!(key in newProps)) {
        hostPatchProps(el, key, oldProps[key], null)
      }
    }
  }


  function patchChilren(n1: any, n2: any, container: any, parentComponent, anchor) {
    const prevShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag

    const prevChildren = n1.children
    const nextChildren = n2.children

    // 新节点是文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      // 新的节点是text
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 清空旧子节点
        unmountChildren(prevChildren)
      }
      if (prevChildren !== nextChildren) {
        hostSetElementText(container, nextChildren)
      }
    } else {
      // 新节点是数组
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 旧节点是文本
        hostSetElementText(container, '')
        mountChildren(nextChildren, container, parentComponent, anchor)
      } else {
        // 旧节点是数组
        patchKeyedChildrend(prevChildren, nextChildren, container, parentComponent, anchor)
      }
    }
  }

  function patchKeyedChildrend(c1, c2, container, parentComponent, parentAnchor) {
    // 双端对比算法
    let l2 = c2.length;
    let i = 0, e1 = c1.length -1, e2 = l2 - 1;
    // 对比头部
    while (i <= e1 && i <= e2) {
      let n1 = c1[i], n2 = c2[i]
      if (isSameVNodeType(n1, n2))  {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        // 指针往后移动直到第一个不一样的节点
        break;
      }
      i++
    }
    // 对比尾部
    while (i <= e1 && i <= e2) {
      let n1 = c1[e1], n2 = c2[e2]
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, parentAnchor)
      } else {
        break
      }
      // 尾部指针前移
      e1--;
      e2--;
    }

    // 新节点较长
    if (i > e1) {
      if (i <= e2) {
        // 新节点一个个patch
        const nextPos = e2 + 1; // 新节点插入在anchor之前
        const anchor = nextPos < l2 ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentComponent, anchor)
          i++
        }
      }
    } else if (i > e2) {
      // 新节点较短
      while (i <= e1) {
        // 删除旧的多余节点
        hostRemove(c1[i].el)
        i++
      }
    }
  }
  function isSameVNodeType(n1: any, n2: any) {
    return (n1.type === n2.type) && (n1.key === n2.key)
  }


  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i]
      hostRemove(el)
    }
  }
  // 返回作为库的入口
  return {
    createApp: createAppAPI(render)
  }
}

