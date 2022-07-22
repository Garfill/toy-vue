import { reactive } from '../reactive'

it('reactive', () => {
  let obj = reactive({ foo: 1 })
  expect(obj.foo).toBe(1)
});