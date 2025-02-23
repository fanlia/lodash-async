export class Observable {
  constructor(subscriber) {
    this.subscriber = subscriber
  }

  subscribe(observer) {
    return this.subscriber(observer)
  }
}
