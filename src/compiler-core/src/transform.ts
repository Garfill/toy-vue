import { NodeTypes } from "./ast";
import { TO_DISPLAY_STRING } from "./runtimeHelpers";

export default function transform(root, options = {}) {
  const context = createTransformContext(root, options)
  // 1. DFS 遍历
  // 2. 修改对应节点
  traverseNode(root, context)
  createRootCodegen(root, context);

  root.helpers = [...context.helpers.keys()]
}

function createRootCodegen(root, context) {
  const child = root.children[0];
  if (child.type === NodeTypes.ELEMENT) {
    root.codegenNode = child.codegenNode
  } else {
    root.codegenNode = root.children[0];
  }

}

function traverseNode(node: any, context) {
  console.log('traverse >>>>', node)
  const nodeTransforms = context.nodeTransforms || []
  const exitFns: any = [] // 复合类型节点需改变ast结构，通过返回函数，延迟执行
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i];
    const onExit = transform(node, context)
    if (onExit) {
      exitFns.push(onExit)
    }
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(TO_DISPLAY_STRING)
      break
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);
      break;
    default:
      break
  }

  console.log('traverseEnd, ', node)
  let i = exitFns.length
  while (i--) {
    exitFns[i]()
  }
  
}

function traverseChildren(node: any, context: any) {
  const { children } = node;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    traverseNode(child, context);
  }
}

function createTransformContext(root: any, options: any) {
  const context = {
    root,
    nodeTransforms: options.nodeTransforms,
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, 1)
    }
  }

  return context
}

