import { reactive } from "../reactive";
import { ref } from "../ref";
import { watch } from "../watch";


describe('watch', () => {
  it('happy path', () => {
    const a = ref(1)
    const data = reactive({ count: 0 })
    let newV, oldV
    watch(a, (oldVal, newVal) => {
      newV = newVal;
      oldV = oldVal;
      data.count++;
    })
    a.value = 2
    expect(oldV).toBe(1);
    expect(newV).toBe(2);
    expect(data.count).toBe(1);
    a.value = 10
    expect(oldV).toBe(2);
    expect(newV).toBe(10);
    expect(data.count).toBe(2);
  });
});