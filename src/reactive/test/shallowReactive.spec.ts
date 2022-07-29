import { isReactive, shallowReactive } from "../reactive";

describe('shallow reactive', () => {
  it('happt path', () => {
    let origin = {
      n: { foo: 1 },
      jazz: {
        zoo: [1,2,3]
      }
    }

    const shallow = shallowReactive(origin)

    expect(isReactive(shallow)).toBe(true);
    expect(isReactive(shallow.n)).toBe(false)
    expect(isReactive(shallow.jazz.zoo)).toBe(false)
  });
});