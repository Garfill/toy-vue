import { ShapeFlags } from "../../shapeFlags"
import { effect } from "../reactive/effect"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
  // 不同平台传入的渲染元素接口
  const { createElement: hostCreateElement, patchProps: hostPatchProps, insert: hostInsert } = options

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
        instance.vnode.el = subTree.el
      }
    })
  }
  
  function processElement(n1, n2: any, container: any, parentComponent) {
    if (!n1) {
      // n1 不存在，也就是null，初始化逻辑
      mountElement(n2, container, parentComponent)
    } else {
      patchElement(n1, n2, container)
    }
  }
  
  function mountElement(vnode: any, container: any, parentComponent) {
    // 创建节点
    // let el = document.createElement(vnode.type)
    let el = vnode.el = hostCreateElement(vnode.type)
    let { props } = vnode
    // 子节点
    mountChildren(vnode, el, parentComponent)
    // 添加 propsData
  
    // 事件监听函数和设置属性
    for (let key in props) {
      const val = props[key]
      hostPatchProps(el, key, val)
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

  function patchElement(n1: any, n2: any, container: any) {
    console.log(arguments)
  }
  
  function mountChildren(vnode, el, parentComponent) {
    let { children, shapeFlag } = vnode
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      el.textContent = children
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      children.forEach(v => {
        patch(null, v, el, parentComponent)
      });
    }
  }
  
  function processFragment(n1, n2: any, container: any, parentComponent) {
    mountChildren(n2, container, parentComponent)
  }
  
  function processText(n1, n2: any, container: any) {
    let text = n2.el = document.createTextNode(n2.children)
    container.appendChild(text)
  }


  return {
    createApp: createAppAPI(render)
  }
}


