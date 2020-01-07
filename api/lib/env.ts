import { warning } from './log'

const hasProxy = new Proxy(process.env, {
  get (env: Record<string, string>, prop: string) {
    return !!env[prop]
  },
})

const handler = {
  get (env: Record<string, string>, prop: string) {
    if (prop === 'has') {
      return hasProxy
    }

    const value = env[prop]

    if (!value && process.env.NODE_ENV === 'production') {
      warning(`Missing environment variable %s`, prop)
      return ''
    }

    return value
  },
}

export default new Proxy(process.env, handler) as Record<string, string> & {
  has: Record<string, boolean>;
}
