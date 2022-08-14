import { ShapeFlags } from "../../shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { Fragment, Text } from "./vnode"

/**
 * 
 * @param vnode 虚拟节点
 * @param container 组件容器元素
 */
export function render(vnode, container, parentComponent?) {
  // patch
  patch(vnode, container, parentComponent)
}

function patch(vnode, container, parentComponent) {
  // 处理组件或者element 的 patch
  switch (vnode.type) {
    case Fragment:
      processFragment(vnode, container, parentComponent)
      break;
    case Text:
      processText(vnode, container)
      break
    default:
      // 处理组件类型
      if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentComponent)
      } else if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentComponent)
      }
      break;
  }
}

function processComponent(vnode: any, container: any, parentComponent: any) {
  mountComponent(vnode, container, parentComponent)
}

function mountComponent(vnode: any, container: any, parentComponent: any) {
  const instance = createComponentInstance(vnode, parentComponent)
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const { proxy } = instance
  // 绑定render的this
  const subTree = instance.render.call(proxy); // 虚拟节点树 vnode

  patch(subTree, container, instance) // 处理完组件类型，生成组件内部的vnode，递归调用patch挂载subTree

  // 当前组件Component在render完成之后
  instance.vnode.el = subTree.el
}

function processElement(vnode: any, container: any, parentComponent) {
  mountElement(vnode, container, parentComponent)
}

function mountElement(vnode: any, container: any, parentComponent) {
  // 创建节点
  let el = document.createElement(vnode.type)
  vnode.el = el
  let { props } = vnode
  // 子节点
  mountChildren(vnode, el, parentComponent)
  // 添加 propsData

  // 是否是事件监听函数
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  for (let key in props) {
    const val = props[key]
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase() // 取出事件名
      el.addEventListener(event, val)
    } else {
      el.setAttribute(key, val)
    }
  }

  // 挂载
  container.appendChild(el)
}

function mountChildren(vnode, el, parentComponent) {
  let { children } = vnode
  if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children
  } else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    children.forEach(v => {
      patch(v, el, parentComponent)
    });
  }
}

function processFragment(vnode: any, container: any, parentComponent) {
  mountChildren(vnode, container, parentComponent)
}

function processText(vnode: any, container: any) {
  let text = vnode.el = document.createTextNode(vnode.children)
  container.appendChild(text)
}

