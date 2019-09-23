import express from 'express'
import { buildVariables } from '../../buildVariables'
import { expand } from '@zazuko/rdf-vocabularies'
import { getProjectId } from '../project'
import { construct } from '../../sparql'

export async function createFactTable (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  const projectId = getProjectId(req.params.projectId)
  const variables = buildVariables(req, {
    source: expand('dataCube:source'),
  })

  await req.sparql.updateQuery(`
    PREFIX dataCube: <https://rdf-cube-curation.described.at/>
    
    DELETE {
      GRAPH <${projectId}/fact-table> {
        ?s ?p ?o  
      }
    }
    INSERT {
      GRAPH <${projectId}/fact-table> 
      {
        <${projectId}/fact-table> a dataCube:Table ;
           dataCube:source <${variables.source.value}> ; 
           dataCube:project <${projectId}> .
      }
    } 
    WHERE 
    {
      OPTIONAL 
      {
        GRAPH <${projectId}/fact-table> 
        { 
          ?s ?p ?o 
        }
      }
    }`).catch(next)

  res.status(201)

  next()
}

export async function get (req: express.DataCubeRequest, res: express.DataCubeResponse, next: express.NextFunction) {
  const query = construct()
    .from(`${process.env.BASE_URI}${req.path.substring(1)}`)
    .graph(`?s ?p ?o`)
    .where(`?s ?p ?o`)

  query.execute(req.sparql).then(graph => {
    res.graph(graph)
  }).catch(next)
}
