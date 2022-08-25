import { generate } from "../src/codegen";
import { baseParse } from "../src/parse";
import transform from "../src/transform";

test('string', () => {
  const ast: any = baseParse("hello");
  transform(ast, {})
  const { code } = generate(ast);
  expect(code).toMatchSnapshot();

})