import { Observable, observable_as_iterator } from './Observable.js'
import { delay } from './util.js'

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
    yield* observable_as_iterator(array)
  } else {
    yield await array
  }
}
