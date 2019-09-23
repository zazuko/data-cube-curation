import express from 'express'
import $rdf from 'rdf-ext'
import cf from 'clownface'
import { api, rdf, rdfs, dataCube } from '../../namespaces'

export async function duplicateNameErrorResponse (req: express.Request, res: express.DataCubeResponse) {
  const graph = cf($rdf.dataset(), api.duplicateSourceError)

  graph.addOut(rdfs.label, 'Could not create source')
  graph.addOut(rdfs.comment, 'The selected file has already been uploaded to the project.')
  graph.addOut(rdf.type, api.Error)
  graph.addOut(dataCube.project, $rdf.namedNode(res.locals.projectId), project => {
    project.addOut(rdf.type, dataCube.Project)
  })

  res.status(409)
  res.graph(graph.dataset)
  res.setLink(api.duplicateSourceError.value, 'canonical')
}
