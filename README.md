# lodash-async

lodash of async style

## examples

```javascript
import { reduce, chain } from 'lodash-async'

test('filter', async (t) => {
  const value = [2, 3, 4]
  const expect = [3, 4]
  const actual = await filter(value, async (d) => d > 2)
  assert.deepEqual(expect, actual)
})

test('chain', async (t) => {
  const value = [2, 3, 4]
  const expect = [[2, 3], [4]]
  const actual = await chain([1, 2, 3])
    .map((d) => d + 1)
    .chunk(2)
    .value()
  assert.deepEqual(expect, actual)
})
```

## test

```sh
npm test
```
