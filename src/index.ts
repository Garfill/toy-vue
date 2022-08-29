//  toy-vue 入口文件
export * from './runtime-dom'
// export * from './reactive'

import * as runtimeDom from './runtime-dom'
import { registerRuntimeCompiler } from './runtime-dom'
import { baseCompile } from './compiler-core/src'

function compileToFunc(template) {
  const { code } = baseCompile(template)
  const render = new Function("Vue", code)(runtimeDom)
  return render
}

registerRuntimeCompiler(compileToFunc)