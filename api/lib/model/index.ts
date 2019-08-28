import uuid from 'uuid/v4'

export function getmodelId (modelGuid: string = uuid()) {
  return `${process.env.BASE_URI}model/${modelGuid}`
}

export function initNew (req, res, next) {
  res.locals.modelId = getmodelId(uuid())
  next()
}

export function initExisting (req, res, next) {
  res.locals.modelId = getmodelId(req.params.modelId)
  next()
}
