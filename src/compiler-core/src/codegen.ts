import { NodeTypes } from "./ast"
import { helperMapName, TO_DISPLAY_STRING } from "./runtimeHelpers"

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
  const aliasHelper = (s) => `${s}: _${s}`
  if (helpers.length) {
    push(`const {${helpers.map(aliasHelper).join(', ')}} = ${VueBinding}`)
  }
  push('\n')
  console.log(context.code)
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

