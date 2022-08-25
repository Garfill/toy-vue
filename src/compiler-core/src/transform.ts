export default function transform(root, options) {
  const context = createTransformContext(root, options)
  // 1. DFS 遍历
  traverseNode(root, context)
  // 2. 修改对应节点

}
function traverseNode(node: any, context) {
  console.log('traverse >>>>', node)
  const nodeTransform = context.nodeTransform
  for (let i = 0; i < nodeTransform.length; i++) {
    const transform = nodeTransform[i];
    transform(node)
    
  }
  traverseChildren(node, context);
}

function traverseChildren(node: any, context: any) {
  const { children } = node;
  if (children) {
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      traverseNode(child, context);
    }
  }
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransform: options.nodeTransform
  }

  return context
}

