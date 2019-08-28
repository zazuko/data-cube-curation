export function setResponse (req, res, next) {
  res.status(201)
  res.setHeader('Location', res.locals.modelId)
  next()
}
