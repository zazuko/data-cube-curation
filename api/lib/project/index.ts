import { expand } from '@zazuko/rdf-vocabularies'

export function getProjectId (req) {
  const projectGuid = req.graph.match(null, expand('schema:id')).toArray()[0].object.value

  return `${process.env.BASE_URI}project/${projectGuid}`
}
