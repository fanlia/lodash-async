import { as_iterator } from './iterator.js'
import { identity } from './util.js'

export const forEach = async (array_like, fn = identity) => {
  const array = await as_iterator(array_like)
  let i = 0
  for await (const item of array) {
    await fn(item, i)
    i++
  }
  return i
}

export const map = async (array, fn = identity) => {
  let data = []
  await forEach(array, async (...args) => {
    const new_item = await fn(...args)
    data.push(new_item)
  })
  return data
}

export const filter = async (array, fn) => {
  let data = []
  await forEach(array, async (item, ...args) => {
    const ok = await fn(item, ...args)
    if (ok) {
      data.push(item)
    }
  })
  return data
}

export const reduce = async (array, fn, memo) => {
  let data = memo
  await forEach(array, async (...args) => {
    data = await fn(data, ...args)
  })
  return data
}

export const keyBy = async (array, fn = identity) => {
  let data = {}
  await forEach(array, async (item, ...args) => {
    const new_item = await fn(item, ...args)
    data[new_item] = item
  })
  return data
}

export const groupBy = async (array, fn = identity) => {
  let data = {}
  await forEach(array, async (item, ...args) => {
    const new_item = await fn(item, ...args)
    if (data[new_item] === undefined) {
      data[new_item] = []
    }
    data[new_item].push(item)
  })
  return data
}

export const countBy = async (array, fn = identity) => {
  let data = {}
  await forEach(array, async (item, ...args) => {
    const new_item = await fn(item, ...args)
    if (data[new_item] === undefined) {
      data[new_item] = 0
    }
    data[new_item]++
  })
  return data
}

export const chunk = async (array, size = 1) => {
  let data = []
  let temp = []
  await forEach(array, async (item) => {
    if (temp.length < size) {
      temp.push(item)
    } else {
      data.push(temp)
      temp = [item]
    }
  })
  if (temp.length > 0) {
    data.push(temp)
  }
  return data
}

export const uniq = async (array, fn = identity) => {
  let data = []
  let uniq_map = {}
  await forEach(array, async (item, ...args) => {
    const new_item = await fn(item, ...args)
    if (uniq_map[new_item]) {
      return
    }
    data.push(item)
    uniq_map[new_item] = true
  })
  return data
}

export const get = async (data, fn = identity) => {
  return fn(data)
}

export const mapKeys = async (object, fn = identity) => {
  const array = Object.entries(object)
  const result = await map(array, async ([key, value], i) => {
    const new_key = await fn(value, key, i)
    return [new_key, value]
  })
  return Object.fromEntries(result)
}

export const mapValues = async (object, fn = identity) => {
  const array = Object.entries(object)
  const result = await map(array, async ([key, value], i) => {
    const new_value = await fn(value, key, i)
    return [key, new_value]
  })
  return Object.fromEntries(result)
}
