import { identity, nope } from './util.js'

export class Observable {
  constructor(subscriber) {
    this.subscriber = subscriber
  }

  pipe(...pipers) {
    return pipers.reduce((m, piper) => piper(m), this)
  }

  subscribe(observer) {
    return this.subscriber(observer) || nope
  }
}

export const log_subscriber = {
  next(value) {
    console.log({ value })
  },
  error(err) {
    console.log({ error: err })
  },
  complete() {
    console.log('complete')
  },
}

export function fromEvent(source, event_name) {
  return new Observable((subscriber) => {
    const handler = (e) => subscriber.next(e)
    source.addEventListener(event_name, handler)
    return () => {
      source.removeEventListener(event_name, handler)
    }
  })
}

export function interval(interval_time) {
  return new Observable((subscriber) => {
    let i = 0
    subscriber.next(i++)
    let interval_id = setInterval(() => {
      subscriber.next(i++)
    }, interval_time)
    return () => {
      clearInterval(interval_id)
    }
  })
}

function normalize_state(state) {
  if (typeof state === 'function') {
    return {
      async done() {
        return false
      },
      update: state,
    }
  }

  return {
    async done() {
      return false
    },
    update: identity,
    ...state,
  }
}

export function operate(state) {
  state = normalize_state(state)

  return (observable) =>
    new Observable(async (subscriber) => {
      try {
        if (await state.done()) {
          subscriber.complete()
          return
        }
      } catch (err) {
        subscriber.error(err)
        return
      }

      const unsubscribe = await observable.subscribe({
        async next(value) {
          if (!(await state.done())) {
            try {
              const new_value = await state.update(value)
              if (new_value !== undefined) {
                await subscriber.next(new_value)
              }
            } catch (err) {
              unsubscribe()
              subscriber.error(err)
              return
            }
          }
          if (await state.done()) {
            unsubscribe()
            subscriber.complete()
          }
        },
        error(err) {
          subscriber.error(err)
        },
        complete() {
          subscriber.complete()
        },
      })

      return () => {
        unsubscribe()
      }
    })
}

export function operate_take(size = 1) {
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

export function operate_map(fn) {
  const state = {
    async update(value) {
      return fn(value)
    },
  }
  return operate(state)
}

export function operate_filter(fn) {
  const state = {
    async update(value) {
      if (await fn(value)) {
        return value
      }
    },
  }
  return operate(state)
}

export function operate_reduce(fn, memo) {
  const state = {
    async update(value) {
      memo = await fn(memo, value)
      return memo
    },
  }
  return operate(state)
}
