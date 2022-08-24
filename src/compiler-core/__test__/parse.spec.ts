import { NodeTypes } from "../src/ast"
import { baseParse } from "../src/parse"

describe('parse', () => {
  
  describe('interpolation', () => {
    test('simple text', () => {
      const ast = baseParse("{{ hello parse   }}")
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.INTERPOLATION,
        content: {
          type: NodeTypes.SIMPLE_EXPRESSION,
          content: 'hello parse'
        }
      })
    })
  })

  describe('element', () => {
    test('simple text', () => {
      const ast = baseParse("<div></div>")
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'div'
      })
    })
  })

  describe('text', () => {
    test('simple text', () => {
      const ast = baseParse("simple text")
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: 'simple text'
      })
    })
  })
})