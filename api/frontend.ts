import fallback from 'express-history-api-fallback'
import express from 'express'
import env from './lib/env'

const app = express()

const staticFileMiddleware = express.static('../ui')
app.use(staticFileMiddleware)
app.use(fallback('index.html', { root: `${__dirname}/../ui` }))

export function rootRedirect (req, res, next) {
  if (req.accepts('html')) {
    return res.redirect('/app')
  }

  next()
}

export function uiConfig (req, res) {
  res.header('content-type', 'application/javascript')
  res.write(`
window.config = {
  oidc: {
    authority: '${env.AUTH_ISSUER}',
    clientId: '${env.AUTH_AUDIENCE}',
  },
}`)
  res.end()
}

export default app
