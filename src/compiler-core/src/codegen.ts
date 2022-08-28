import { isString } from "../../share"
import { NodeTypes } from "./ast"
import { CREATE_ELEMENT_VNODE, helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"

export function generate(ast) {
  const context = createGenerateContext(ast)
  const { push } = context

  genFunctionPreamble(ast, context)

  push('return ')
  const functionName = 'rendner'
  const args = ['_ctx', '_cache']
  const signature = args.join(', ')
  push(`function ${functionName}(${signature}) {`)

  // 函数内容
  push('return ')
  genNode(ast.codegenNode, context)


  push("}")
  return {
    code: context.code
  }
}

function genFunctionPreamble(ast: any, context) {
  const { push } = context
  const VueBinding = 'Vue'
  const helpers = ast.helpers
  const aliasHelper = (s) => `${helperMapName[s]}: _${helperMapName[s]}`
  if (helpers.length) {
    push(`const {${helpers.map(aliasHelper).join(', ')}} = ${VueBinding}`)
  }
  push('\n')
}

function genNode(node, context) {
  switch (node.type) {
    case NodeTypes.TEXT:
      genTextCode(node, context)
      break;
    case NodeTypes.INTERPOLATION:
      genInterpolationCode(node, context)
      break;
    case NodeTypes.SIMPLE_EXPRESSION:
      genExpressionCode(node, context)
      break;
    case NodeTypes.ELEMENT:
      genElementCode(node, context)
      break;
    case NodeTypes.COMPOUND_EXPRESSION:
      genCompoundExpressionCode(node, context)
      break;
    default:
      break;
  }
}

function createGenerateContext(ast: any) {
  let context = {
    ast,
    code: '',
    push(source) {
      context.code += source
    },
    helper(key) {
      return `_${helperMapName[key]}`
    }
  }

  return context
}

function genTextCode(node: any, context) {
  const { push } = context
  push(`'${node.content}'`)
}

function genInterpolationCode(node: any, context: any) {
  const { push, helper } = context
  push(`${helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content, context)
  push(')')
}

function genExpressionCode(node: any, context: any) {
  const { push } = context
  push(node.content)
}

function genElementCode(node: any, context: any) {
  const { push, helper } = context
  const { tag, children, props } = node
  // 此处的 node ，参照transformElement的vnodeElement，其中的children就是原来的children[0]
  push(`${helper(CREATE_ELEMENT_VNODE)}(`)
  // for (let i = 0; i < children.length; i++) {
  //   const child = children[i];
  //   genNode(child, context)
  // }
  genNodeList(genNullable([tag, props, children]), context)
  // genNode(children, context)
  push(')')
}

function genCompoundExpressionCode(node: any, context: any) {
  const { push } = context
  const { children } = node
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isString(child)) {
      push(child)
    } else {
      genNode(child, context)
    }
  }
}

function genNullable(args) {
  return args.map((arg) => arg ? arg : "null")
}

function genNodeList(nodes, context) {
  console.log('nodes>>>>>>>', nodes)
  const { push } = context
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (isString(node)) {
      push(node)
    } else {
      genNode(node, context)
    }
    if (i < nodes.length - 1) {
      push(', ')
    }
  }
}

