import fs from 'fs'
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

  if (env.AUTH_CONFIG_FILE) {
    const stream = fs.createReadStream(env.AUTH_CONFIG_FILE)
    stream.pipe(res)
  } else {
    res.send(`
window.oidc = {
  authority: '${env.AUTH_ISSUER}',
  clientId: '${env.AUTH_CLIENT_ID}',
  scope: 'profile pipelines:read pipelines:write',
}`)
  }
}

export default app
