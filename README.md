# lodash-async

lodash of async style

## usage

```sh
npm i lodash-async
```

## examples

```javascript
import test from 'node:test'
import assert from 'node:assert/strict'

import {
  Observable,
  interval,
  operate_take,
  operate_map,
  operate_filter,
  operate_reduce,
  operate,
  get,
  forEach,
  map,
  filter,
  reduce,
  mapKeys,
  mapValues,
  chunk,
  uniq,
  compact,
  keyBy,
  groupBy,
  countBy,
  chain,
} from 'lodash-async'

test('get', async (t) => {
  const value = [2, 3, 4]
  const expect = value.length
  const actual = await get(value, (d) => d.length)
  assert.deepEqual(expect, actual)
})

test('forEach', async (t) => {
  const value = [2, 3, 4]
  const expect = value.length
  const actual = await forEach(value)
  assert.deepEqual(expect, actual)
})

test('map array', async (t) => {
  const value = [2, 3, 4]
  const expect = [2, 3, 4]
  const actual = await map(value)
  assert.deepEqual(expect, actual)
})

test('map promise', async (t) => {
  const value = async () => [2, 3, 4]
  const expect = [2, 3, 4]
  const actual = await map(value)
  assert.deepEqual(expect, actual)
})

test('map iterator', async (t) => {
  const value = function* () {
    yield 2
    yield 3
    yield 4
  }
  const expect = [2, 3, 4]
  const actual = await map(value)
  assert.deepEqual(expect, actual)
})

test('map observable', async (t) => {
  const value = new Observable((subscriber) => {
    subscriber.next(2)
    subscriber.next(3)
    setTimeout(() => {
      subscriber.next(4)
      subscriber.complete()
    }, 100)
  })
  const expect = [2, 3, 4]
  const actual = await map(value)
  assert.deepEqual(expect, actual)
})

test('map observable with pipe', async (t) => {
  const value = interval(100).pipe(operate_take(4))
  const expect = [0, 1, 2, 3]
  const actual = await map(value)
  assert.deepEqual(expect, actual)
})

test('map observable with operate_map', async (t) => {
  const value = interval(100).pipe(
    operate_map((d) => d + 1),
    operate_take(4),
  )
  const expect = [1, 2, 3, 4]
  const actual = await map(value)
  assert.deepEqual(expect, actual)
})

test('map observable with operate_map can flattern', async (t) => {
  const value = interval(100).pipe(
    operate_map((d) => [d, d]),
    operate_take(4),
  )
  const expect = [0, 0, 1, 1]
  const actual = await map(value)
  assert.deepEqual(expect, actual)
})

test('map observable with operate_filter', async (t) => {
  const value = interval(100).pipe(
    operate_filter((d) => d % 2 === 0),
    operate_take(4),
  )
  const expect = [0, 2, 4, 6]
  const actual = await map(value)
  assert.deepEqual(expect, actual)
})

test('map observable with operate_reduce', async (t) => {
  const value = interval(100).pipe(
    operate_reduce((m, d) => m + d, 0),
    operate_take(4),
  )
  const expect = [0, 1, 3, 6]
  const actual = await map(value)
  assert.deepEqual(expect, actual)
})

test('map observable with custom operate', async (t) => {
  function operate_custom_take(size = 1) {
    const state = {
      async done() {
        return size < 1
      },
      async update(value) {
        size--
        return value
      },
    }
    return operate(state)
  }
  const value = interval(100).pipe(operate_custom_take(4))
  const expect = [0, 1, 2, 3]
  const actual = await map(value)
  assert.deepEqual(expect, actual)
})

test('flatMap', async (t) => {
  const value = [2, 3, 4]
  const expect = [2, 2, 3, 3, 4, 4]
  const actual = await flatMap(value, async (d) => [d, d])
  assert.deepEqual(expect, actual)
})

test('filter', async (t) => {
  const value = [2, 3, 4]
  const expect = [3, 4]
  const actual = await filter(value, async (d) => d > 2)
  assert.deepEqual(expect, actual)
})

test('reduce', async (t) => {
  const value = [2, 3, 4]
  const expect = 9
  const actual = await reduce(value, async (m, d) => m + d, 0)
  assert.deepEqual(expect, actual)
})

test('mapKeys', async (t) => {
  const value = { a: 2, b: 3, c: 4 }
  const expect = { key_a: 2, key_b: 3, key_c: 4 }
  const actual = await mapKeys(value, async (value, key) => 'key_' + key)
  assert.deepEqual(expect, actual)
})

test('mapValues', async (t) => {
  const value = { a: 2, b: 3, c: 4 }
  const expect = { a: 3, b: 4, c: 5 }
  const actual = await mapValues(value, async (d) => d + 1)
  assert.deepEqual(expect, actual)
})

test('chunk', async (t) => {
  const value = [2, 3, 4]
  const expect = [[2, 3], [4]]
  const actual = await chunk(value, 2)
  assert.deepEqual(expect, actual)
})

test('compact', async (t) => {
  const value = [2, false, 3, '', 4]
  const expect = [2, 3, 4]
  const actual = await compact(value)
  assert.deepEqual(expect, actual)
})

test('uniq', async (t) => {
  const value = [1, 2, 3, 2, 4, 1]
  const expect = [1, 2, 3, 4]
  const actual = await uniq(value)
  assert.deepEqual(expect, actual)
})

test('countBy', async (t) => {
  const value = [1, 2, 3, 2, 4, 1]
  const expect = { 1: 2, 2: 2, 3: 1, 4: 1 }
  const actual = await countBy(value)
  assert.deepEqual(expect, actual)
})

test('groupBy', async (t) => {
  const value = [1, 2, 3, 2, 4, 1]
  const expect = { 1: [1, 1], 2: [2, 2], 3: [3], 4: [4] }
  const actual = await groupBy(value)
  assert.deepEqual(expect, actual)
})

test('keyBy', async (t) => {
  const value = [1, 2, 3, 2, 4, 1]
  const expect = { 1: 1, 2: 2, 3: 3, 4: 4 }
  const actual = await keyBy(value)
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

```javascript
import { fromEvent, fromFetch, log_subscriber } from 'lodash-async'

fromEvent(document, 'click').subscribe(log_subscriber)

fromFetch('http://localhost:11434/api/generate', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model: 'qwen2.5:0.5b',
    prompt: 'hello',
  }),
}).subscribe(log_subscriber)
```

## test

```sh
npm test
```
