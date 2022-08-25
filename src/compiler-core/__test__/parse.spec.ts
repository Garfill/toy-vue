import { NodeTypes } from "../src/ast"
import { baseParse } from "../src/parse"

describe('parse', () => {
  
  describe('interpolation', () => {
    test('simple interpolation', () => {
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
    test('simple element', () => {
      const ast = baseParse("<div></div>")
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: 'div',
        children: [],
      })
    })
  })

  describe('text', () => {
    test('text', () => {
      const ast = baseParse("simple text")
      expect(ast.children[0]).toStrictEqual({
        type: NodeTypes.TEXT,
        content: 'simple text'
      })
    })
  })

  describe("Element", () => {
    test("simple div", () => {
      const ast = baseParse("<div>hello</div>");
      const element = ast.children[0];

      expect(element).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeTypes.TEXT,
            content: "hello",
          },
        ],
      });
    });

    test("element with interpolation", () => {
      const ast = baseParse("<div>{{ msg }}</div>");
      const element = ast.children[0];

      expect(element).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: `msg`,
            },
          },
        ],
      });
    });

    test("element with interpolation and text", () => {
      const ast = baseParse("<div>hi,{{ msg }}</div>");
      const element = ast.children[0];

      expect(element).toStrictEqual({
        type: NodeTypes.ELEMENT,
        tag: "div",
        children: [
          {
            type: NodeTypes.TEXT,
            content: "hi,",
          },
          {
            type: NodeTypes.INTERPOLATION,
            content: {
              type: NodeTypes.SIMPLE_EXPRESSION,
              content: "msg",
            },
          },
        ],
      });
    });

    test("should throw error when lack end tag  ", () => {
      // baseParse("<div><span></div>");
      expect(() => {
        baseParse("<div><span></div>");
      }).toThrow(`Missing close tag for Element or Component span`);
    });
  });

})