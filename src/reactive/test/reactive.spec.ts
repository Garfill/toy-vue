import { isReactive, reactive } from '../reactive'

it('reactive', () => {
  const original = { foo: 1 }
  let obj = reactive(original)
  expect(obj.foo).toBe(1)

  expect(isReactive(original)).toBe(false)
  expect(isReactive(obj)).toBe(true)
});