import { NodeTypes } from "../ast";
import { isText } from "../utils";


export function transformText(node, context) {
  const { children } = node
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
      let currentContainer
      // 每个element节点都可能会有复合类型节点
  
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (isText(child)) {
          // element某一个子节点是文本类型
          // 相邻的也是文本类型
          for (let j = 1; j < children.length; j++) {
            const next = children[j];
            if (isText(next)) {
              if (!currentContainer) {
                // 相邻的文本元素，组合成复合类型
                // 并且替换原有的文本节点
                // 初始化复合节点
                currentContainer = children[i] = {
                  type: NodeTypes.COMPOUND_EXPRESSION,
                  children: [child],
                }
              }
              currentContainer.children.push(' + ')
              currentContainer.children.push(next)
              children.splice(j, 1) // 删除两个相邻的后一个节点
              j--
            } else {
              // 遇到element类型跳出循环
              break;
            }
          }
        }
      }
    }
    
  }
}