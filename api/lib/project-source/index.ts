import * as uuid from 'uuid/v4'

const contentDispositionPattern = /attachment; filename="(.+)"/

export function initNew (req, res, next) {
  const projectId = `${process.env.BASE_URI}project/${req.params.projectId}`
  res.locals.sourceId = `${projectId}/source/${uuid()}`

  const contentDisposition: string = req.headers['content-disposition']
  if (contentDisposition) {
    if (contentDispositionPattern.test(contentDisposition)) {
      res.locals.sourceName = contentDisposition.match(contentDispositionPattern)[1]
    }
  } else {
    res.locals.sourceName = 'unnamed source'
  }
  next()
}

export function initExisting (req, res, next) {
  const projectId = `${process.env.BASE_URI}project/${req.params.projectId}`
  res.locals.sourceId = `${projectId}/source/${req.params.sourceId}`
  next()
}
