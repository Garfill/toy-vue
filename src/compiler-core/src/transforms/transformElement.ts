import { createVNodeCall, NodeTypes } from "../ast";

export function transformElement(node, context) {
  if (node.type === NodeTypes.ELEMENT) {
    return () => {
  
      // element 类型中间处理层
      const { children } = node
      const vnodeTag = `'${node.tag}'`
      let vnodeProps;
      const vnodeChildren = children[0]
      // 这里的children[0] 其实是 那个复合类型的节点
      console.log('vnodeChildren >>>>>>>>>>>', vnodeChildren)
      
      node.codegenNode = createVNodeCall(context, vnodeTag, vnodeProps, vnodeChildren)
    }
  }
}