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
    } else {
      // 中间的乱序对比
      let s1 = i; // 中间对比的起点
      let s2 = i;
      const toBePatch = e2 - s2 + 1; // 新节点列表上需要patch 的个数
      let patched = 0
      // 下方的逻辑仅针对 s1-e1 / s2-e2 的区间节点进行处理
      const keyToNewIndex = new Map() // 新列表 key-index 映射
      for (let i = s2; i <= e2; i++) {
        keyToNewIndex.set(c2[i].key, i)
      }

      // 新列表的index在旧列表上的index映射，0代表没有映射
      const newIndexToOldIndexMap = (new Array(toBePatch)).fill(0)

      let moved = false; // 标记是否需要移动
      let maxNewIndexSoFar = 0; // 理想的递增子序列应该是后一个比前一个大，如果有小于前一个的，就是有移动

      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatch) {
          // 已经将新列表上所有节点都patch过，旧列表上多出来的可以直接删除
          hostRemove(prevChild.el)
          continue
        }
        let newIndex;
        if (prevChild.key != null) {
          // 旧节点有设置key
          newIndex = keyToNewIndex.get(prevChild.key)
        } else {
          // 旧节点没有设置key，循环判断是否在新的节点列表内
          for (let j = s2; j <= e2; j++) {
            if (isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }

        if (newIndex === undefined) {
          // 没有对应的，直接删除
          hostRemove(prevChild.el)
        } else {
          // 旧节点有对应到新节点列表上的某一个节点
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            moved = true
          }
          newIndexToOldIndexMap[newIndex - s2] = i + 1 // 建立index映射，+1 是防止出现为0的情况（新的index -> 旧的index+1）
          patch(prevChild, c2[newIndex], container, parentComponent, null)
          patched++
        }
      }

      // 上面代码patch所有children之后，移动children到对应节点
      // 计算最长递增子序列
      // 返回的是 不连续的、但是递增的、子序列 的！！！索引！！也就是最长的递增子序列索引
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : [];
      let j = increasingNewIndexSequence.length - 1;
      for (let i = toBePatch - 1; i >= 0; i--) {
        // 新列表中的index
        const nextIndex = i + s2;
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null

        if (newIndexToOldIndexMap[i] === 0) {
          // 新旧列表 index的map中没有对应的映射关系，视为新建的节点
          patch(null, nextChild, container, parentComponent, anchor)
        } else if (moved) {
          // 只有在需要移动的时候才移动
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            // 移动
            hostInsert(nextChild.el, container, anchor)
          } else {
            j--
          }
        }

      }
      // 理解：就是把原来 0-n 索引顺序结构的子序列
      // 先缩减成最长递增子序列索引
      // 然后从后往前对比
      // 索引不一样的，取出对应索引的新的vnode（已经patch好），插入对应位置，这样就得到完整递增子序列
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


// 最长递增子序列算法
function getSequence(arr: number[]): number[] {
  const p = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = (u + v) >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p[v];
  }
  return result;
}
