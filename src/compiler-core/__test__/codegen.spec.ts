import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import transform from "../src/transform";
import { transformElement } from "../src/transforms/transformElement";
import { transformExpression } from "../src/transforms/transformExpression";
import { transformText } from "../src/transforms/transformText";



describe('codegen', () => {
  test('string', () => {
    const ast: any = baseParse("hello");
    transform(ast)
    const { code } = generate(ast);
    expect(code).toMatchSnapshot();

  })

  test("interpolation module", () => {
    const ast = baseParse("{{message}}");
    transform(ast, {
      nodeTransforms: [transformExpression]
    });

    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  test("element", () => {
    const ast = baseParse("<div></div>");
    transform(ast, {
      nodeTransforms: [transformElement]
    });

    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });

  test('compbound', () => {
    const ast = baseParse("<div>hi, {{ msg }}</div>");
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText]
    });

    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  })

  test('nested', () => {
    const ast = baseParse("<div><p>{{msg}}</p></div>")
    transform(ast, {
      nodeTransforms: [transformExpression, transformElement, transformText]
    });

    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  })
})  
