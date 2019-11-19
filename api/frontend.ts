import fallback from 'express-history-api-fallback'
import express from 'express'

const app = express()

const staticFileMiddleware = express.static('ui')
app.use(staticFileMiddleware)
app.use(fallback('index.html', { root: `${__dirname}/ui` }))

export function rootRedirect (req, res, next) {
  if (req.accepts('html')) {
    return res.redirect('/app')
  }

  next()
}

export default app
