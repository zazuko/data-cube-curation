import history from 'connect-history-api-fallback'
import express from 'express'

const app = express()

const staticFileMiddleware = express.static('ui')
app.use(staticFileMiddleware)
app.use(history({
  disableDotRule: true,
  verbose: true,
}))

export default app
