const handler = {
  get (env: Record<string, string>, prop: string) {
    const value = env[prop]

    if (!value) {
      throw new Error(`Missing environment variable ${prop}`)
    }

    return value
  },
}

export default new Proxy(process.env, handler) as Record<string, string>
