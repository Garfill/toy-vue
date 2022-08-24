import { NodeTypes } from "./ast"

const openDelimiter = '{{'
const closeDelimiter = '}}'


export function baseParse(content: string) {
  const context = createContext(content)
  return createRoot(parseChildren(context))
}

function parseChildren(context) {
  const nodes: any[] = []
  let node: any
  if (context.source.startsWith(openDelimiter)) {
    node = parseInterpolation(context)
  }
  if (node) {
    nodes.push(node)
  }
  return nodes
}

function createContext(content: string) {
  return {
    source: content
  }
}

function createRoot(children) {
  return {
    children
  }
}


function parseInterpolation(context) {
  // {{message}} -> message
  const closeIndex = context.source.indexOf('}}')
  // context.source = context.source.slice(openDelimiter.length)
  advance(context, openDelimiter.length)

  // 获取内部文本长度
  const contentLength = closeIndex - openDelimiter.length
  const content = context.source.slice(0, contentLength).trim()

  // context.source = context.source.slice(contentLength + closeDelimiter.length)
  advance(context, contentLength + closeDelimiter.length)
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    }
  }
}

function advance(context, step: number) {
  context.source = context.source.slice(step)
}
