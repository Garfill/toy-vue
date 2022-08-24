import { NodeTypes } from "./ast"

const openDelimiter = '{{'
const closeDelimiter = '}}'

const enum TagType {
  OPEN,
  END,
}

export function baseParse(content: string) {
  const context = createContext(content)
  return createRoot(parseChildren(context))
}

function parseChildren(context) {
  const nodes: any[] = []
  let node: any
  let s = context.source
  if (s.startsWith(openDelimiter)) {
    node = parseInterpolation(context)
  } else if (s[0] === '<') {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context)
    }
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
  advanceBy(context, openDelimiter.length)

  // 获取内部文本长度
  const contentLength = closeIndex - openDelimiter.length
  const content = context.source.slice(0, contentLength).trim()

  // context.source = context.source.slice(contentLength + closeDelimiter.length)
  advanceBy(context, contentLength + closeDelimiter.length)
  return {
    type: NodeTypes.INTERPOLATION,
    content: {
      type: NodeTypes.SIMPLE_EXPRESSION,
      content,
    }
  }
}

function advanceBy(context, step: number) {
  context.source = context.source.slice(step)
}


function parseElement(context: any): any {
  // <div></div>
  // 开端标签
  const element = parseTag(context, TagType.OPEN)
  // 闭合标签
  parseTag(context, TagType.END)

  console.log('>>>>>>>>>>>', context.source)
  return element
}

export function parseTag(context, type: TagType) {
  let match: any = /^<\/?([a-z]*)/i.exec(context.source)
  let tag = match[1]
  advanceBy(context, match[0].length)
  advanceBy(context, 1)

  if (type === TagType.END) return

  return {
    type: NodeTypes.ELEMENT,
    tag
  }
}

