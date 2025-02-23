export class Observable {
  constructor(subscriber) {
    this.subscriber = subscriber
  }

  pipe(...pipers) {
    return pipers.reduce((m, piper) => piper(m), this)
  }

  subscribe(observer) {
    return this.subscriber(observer)
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
    return () => source.removeEventListener(event_name, handler)
  })
}

export function interval(interval_time) {
  return new Observable((subscriber) => {
    let i = 0
    subscriber.next(i++)
    let interval_id = setInterval(() => {
      subscriber.next(i++)
    }, interval_time)
    return () => clearInterval(interval_id)
  })
}

export function take(size = 1) {
  return (observable) =>
    new Observable((subscriber) => {
      if (size < 1) {
        subscriber.complete()
        return
      }
      const unsubscribe = observable.subscriber({
        next(value) {
          if (size >= 1) {
            subscriber.next(value)
            size--
          }
          if (size === 0) {
            if (typeof unsubscribe === 'function') {
              unsubscribe()
            }
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
    })
}
