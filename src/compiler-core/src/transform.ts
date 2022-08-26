import { NodeTypes } from "./ast";
import { helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers";

export default function transform(root, options = {}) {
  const context = createTransformContext(root, options)
  // 1. DFS 遍历
  // 2. 修改对应节点
  traverseNode(root, context)
  createRootCodegen(root, context);

  root.helpers = [...context.helpers.keys()]
}

function createRootCodegen(root, context) {
  root.codegenNode = root.children[0];
}

function traverseNode(node: any, context) {
  console.log('traverse >>>>', node)
  const nodeTransform = context.nodeTransform || []
  for (let i = 0; i < nodeTransform.length; i++) {
    const transform = nodeTransform[i];
    transform(node)
  }

  switch (node.type) {
    case NodeTypes.INTERPOLATION:
      context.helper(helperMapName[TO_DISPLAY_STRING])
      break
    case NodeTypes.ROOT:
    case NodeTypes.ELEMENT:
      traverseChildren(node, context);
      break;
    default:
      break
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
    nodeTransform: options.nodeTransform,
    helpers: new Map(),
    helper(key) {
      context.helpers.set(key, 1)
    }
  }

  return context
}

