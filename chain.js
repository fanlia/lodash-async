import * as fns from './fns.js'

export class LodashAsync {
  constructor(value) {
    this._value = value
    this.actions = []
  }

  async value() {
    let data = this._value
    for (const { name, args } of this.actions) {
      const fn = fns[name]
      if (!fn) {
        continue
      }
      data = await fn(data, ...args)
    }
    return data
  }
}

const prototype = Object.keys(fns).reduce(
  (m, name) => ({
    ...m,
    [name]: function (...args) {
      this.actions.push({
        name,
        args,
      })
      return this
    },
  }),
  {},
)

Object.assign(LodashAsync.prototype, prototype)

export const chain = (value) => new LodashAsync(value)
