import { Observable } from './Observable.js'

export async function* as_iterator(array) {
  if (Array.isArray(array)) {
    for await (const item of array) {
      yield item
    }
  } else if (typeof array === 'function') {
    for await (const item of await array()) {
      yield item
    }
  } else if (array instanceof Observable) {
    const data = new Promise((resovle, reject) => {
      let data = []
      array.subscribe({
        next(value) {
          data.push(value)
        },
        error(err) {
          reject(err)
        },
        complete() {
          resovle(data)
        },
      })
    })
    for await (const item of await data) {
      yield item
    }
  } else if (typeof array === 'object') {
    for (const key in array) {
      yield array[key]
    }
  } else {
    yield array
  }
}
