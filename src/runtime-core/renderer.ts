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

  function render(vnode, container, parentComponent?) {
    // patch
    patch(null, vnode, container, parentComponent)
  }

  /**
   * 
   * @param n1 旧vnode
   * @param n2 新vnode
   * @param container 
   * @param parentComponent 
   */
  function patch(n1, n2, container, parentComponent) {
    // 处理组件或者element 的 patch
    const { type, shapeFlag } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentComponent)
        break;
      case Text:
        processText(n1, n2, container)
        break
      default:
        // 处理组件类型
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentComponent)
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentComponent)
        }
        break;
    }
  }

  function processComponent(n1, n2: any, container: any, parentComponent: any) {
    mountComponent(n2, container, parentComponent)
  }

  function mountComponent(vnode: any, container: any, parentComponent: any) {
    const instance = createComponentInstance(vnode, parentComponent)
    setupComponent(instance)
    setupRenderEffect(instance, container)
  }

  function setupRenderEffect(instance, container) {
    effect(() => {
      // 通过 effect 将 数据和视图绑定

      if (!instance.isMounted) {
        // 未初始化
        const { proxy } = instance
        // 绑定render的this
        const subTree = instance.subTree = instance.render.call(proxy) // 虚拟节点树 vnode

        patch(null, subTree, container, instance) // 处理完组件类型，生成组件内部的vnode，递归调用patch挂载subTree

        // 当前组件Component在render完成之后
        instance.vnode.el = subTree.el
        instance.isMounted = true
      } else {
        const { proxy } = instance
        let prevSubTree = instance.subTree
        const subTree = instance.render.call(proxy) // 绑定render的this生成虚拟节点树 vnode
        instance.subTree = subTree // 更新组件的节点树
        patch(prevSubTree, subTree, container, instance) // 处理完组件类型，生成组件内部的vnode，递归调用patch挂载subTree


        // 当前组件Component在render完成之后
        // instance.vnode.el = subTree.el
      }
    })
  }

  function processElement(n1: any, n2: any, container: any, parentComponent) {
    if (!n1) {
      // n1 不存在，也就是null，初始化逻辑
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container, parentComponent)
    }
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    // 创建节点
    // let el = document.createElement(vnode.type)
    let el = vnode.el = hostCreateElement(vnode.type)
    let { props, shapeFlag, children } = vnode
    // 子节点
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else {
      mountChildren(children, el, parentComponent)
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
    hostInsert(el, container)
  }

  function patchElement(n1: any, n2: any, container: any, parentComponent) {
    //  更新props
    let oldProps = n1.props || EMPTY_OBJ
    let newProps = n2.props || EMPTY_OBJ
    let el = n2.el = n1.el
    patchProps(el, oldProps, newProps)

    // 更新子节点
    patchChilren(n1, n2, el, parentComponent)
  }

  function mountChildren(children, el, parentComponent) {
    children.forEach(v => {
      patch(null, v, el, parentComponent)
    });
  }

  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2.children, container, parentComponent)
  }

  function processText(n1, n2: any, container: any) {
    let text = n2.el = document.createTextNode(n2.children)
    container.appendChild(text)
  }

  function patchProps(el, oldProps, newProps) {
    console.log('oldProps', oldProps)
    console.log('newProps', newProps)
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


  function patchChilren(n1: any, n2: any, container: any, parentComponent) {
    const prevShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag

    const prevChildren = n1.children
    const nextChildren = n2.children

    // 1. array to text
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
      // 2. text to array
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        hostSetElementText(container, '')
        mountChildren(nextChildren, container, parentComponent)
      }
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i]
      hostRemove(el)
    }
  }



  return {
    createApp: createAppAPI(render)
  }
}
