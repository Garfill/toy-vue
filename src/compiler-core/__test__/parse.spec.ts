import { NodeTypes } from "../src/ast"
import { baseParse } from "../src/parse"

describe('parse', () => {
  describe('interpolation', () => {
    test('simple', () => {
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
})