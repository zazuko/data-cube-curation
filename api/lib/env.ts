const handler = {
  get (env, prop: string) {
    const value = env[prop]

    if (!value) {
      throw new Error(`Missing environment variable ${prop}`)
    }

    return value
  },
}

export default new Proxy(process.env, handler)
