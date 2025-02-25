export const identity = (item) => item

export const is_true = (item) => !!item

export const nope = () => {}

export const delay = (timeout = 1000) =>
  new Promise((resolve) => setTimeout(resolve, timeout))
