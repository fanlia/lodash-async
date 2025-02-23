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

✔ forEach (1.13798ms)
✔ map array (0.356658ms)
✔ map promise (0.22218ms)
✔ map iterator (0.181525ms)
✔ map observable (101.959613ms)
✔ flatMap (0.695804ms)
✔ filter (0.305824ms)
✔ reduce (0.335008ms)
✔ mapKeys (0.393547ms)
✔ mapValues (0.350497ms)
✔ chunk (0.260771ms)
✔ compact (0.270779ms)
✔ uniq (0.864645ms)
✔ countBy (0.377637ms)
✔ groupBy (0.341891ms)
✔ keyBy (0.277892ms)
✔ chain (0.299232ms)
