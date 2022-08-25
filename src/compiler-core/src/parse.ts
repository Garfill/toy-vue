import { NodeTypes } from "./ast"

const enum TagType {
  START,
  END,
}

export function baseParse(content: string) {
  const context = createContext(content)
  return createRoot(parseChildren(context, [])) // 空数组记录解析过的开始标签元素
}

function parseChildren(context, ancestor) {
  const nodes: any[] = []
  while (!isEnd(context, ancestor)) {
    let node
    let s = context.source
    if (s.startsWith('{{')) {
      node = parseInterpolation(context)
    } else if (s[0] === '<') {
      if (/[a-z]/i.test(s[1])) {
        node = parseElement(context, ancestor)
      }
    }
  
    if (!node) {
      // 默认当成普通文本
      node = parseText(context)
    }
  
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
  const openDelimiter = '{{'
  const closeDelimiter = '}}'

  const closeIndex = context.source.indexOf(closeDelimiter)
  // context.source = context.source.slice(openDelimiter.length)
  advanceBy(context, openDelimiter.length)

  // 获取内部文本长度
  const contentLength = closeIndex - openDelimiter.length
  // const rawContent = context.source.slice(0, contentLength)
  // // context.source = context.source.slice(contentLength + closeDelimiter.length)
  // advanceBy(context, contentLength + closeDelimiter.length)

  const rawContent = parseTextData(context, contentLength)
  const content = rawContent.trim()
  advanceBy(context, closeDelimiter.length)
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


function parseElement(context: any, ancestor: any[]): any {
  // <div></div>
  // 开端标签
  const element: any = parseTag(context, TagType.START)
  ancestor.push(element)
  element.children = parseChildren(context, ancestor)
  ancestor.pop()

  console.log('parse element finish >>>>>>>>>>>', context.source)
  // 闭合标签
  // 需要闭合的标签与ancestor找到对应的才能闭合
  if (startsWithEndTag(context.source, element.tag)) {
    parseTag(context, TagType.END)
  } else {
    throw new Error(`Missing close tag for Element or Component ${element.tag}`)
  }

  return element
}

export function parseTag(context, type: TagType) {
  let match: any = /^<\/?([a-z]*)/i.exec(context.source)
  let tag = match[1]
  advanceBy(context, match[0].length)
  advanceBy(context, 1) // 还有一个 > 尖括号

  if (type === TagType.END) return

  return {
    type: NodeTypes.ELEMENT,
    tag
  }
}

function parseText(context: any) {
  // 解析text过程中嵌套其他的element 或者 插值
  let endTokens = ["{{", "<"]
  let endIndex = context.source.length // 默认截取到最后一位
  for (let token of endTokens) {
    let index = context.source.indexOf(token)
    if (index !== -1 && index < endIndex) {
      endIndex = index
      // 获取距离开头最近的停止符
    }
  }

  const content = parseTextData(context, endIndex)

  console.log('---------------', content)
  return {
    type: NodeTypes.TEXT,
    content,
  }
}

function parseTextData(context, length) {
  let content = context.source.slice(0, length)
  advanceBy(context, content.length)
  return content
}



function isEnd(context, ancestor) {
  // 碰到结束标签
  let s = context.source
  if (s.startsWith('</')) {
    for (let i = ancestor.length - 1; i >= 0; i--) {
      let element = ancestor[i]
      if (startsWithEndTag(context.source, element.tag)) {
        return true
      }
    }
  }
  // 全部解析完全
  return !context.source
}

function startsWithEndTag(source: string, tag: string): boolean {
  return source.startsWith('</') && tag.toLowerCase() === source.slice(2, 2 + tag.length).toLowerCase()
}