import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import transform from "../src/transform";
import { transformExpression } from "../src/transforms/transformExpression";



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
      nodeTransform: [transformExpression]
    });

    const { code } = generate(ast);
    expect(code).toMatchSnapshot();
  });


})  
