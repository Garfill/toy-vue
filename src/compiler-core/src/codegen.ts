export function generate(ast) {
  const context = createGenerateContext(ast)
  const { push } = context
  push('return ')
  const functionName = 'rendner'
  const args = ['_ctx', '_cache']
  const signature = args.join(', ')
  push(`function ${functionName}(${signature}) {`)

  // 函数内容
  push('return ')
  genCode(ast.codegenNode, context )


  push("}")
  return {
    code: context.code
  }
}

function genCode(node, context) {
  const { push } = context
  push(`'${node.content}'`)
}

function createGenerateContext(ast: any) {
  let context = {
    ast,
    code: '',
    push(source) {
      context.code += source
    }
  }

  return context
}
