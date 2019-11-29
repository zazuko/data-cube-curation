import { construct } from '../../sparql'
import { getClient } from '../sparqlClient'
import { api, dataCube, hydra, rdf, schema } from '../../namespaces'
import $rdf = require('rdf-ext');

export async function getSourceCollection (projectId: string) {
  const dataset = $rdf.dataset()

  await dataset.import(await construct()
    .graph(`
      ?collection
          a hydra:Collection ;
          hydra:member ?source ;
          hydra:totalItems ?count .
  
      ?source
          schema:name ?name ;
          api:sample ?sample .`)
    .where(`
      BIND (<${projectId}/sources> as ?collection)
      BIND (<${projectId}> as ?project)
  
      OPTIONAL {
          ?source a dataCube:Source ;
                  dataCube:project ?project ;
                  schema:name ?name .
  
          BIND (iri(CONCAT(replace(str(?source), "/source/", "/source-sample/"))) as ?sample)
      }
  
      {
          SELECT (COUNT(?source) as ?count) WHERE {
              BIND (<${projectId}> as ?project)
  
              ?source dataCube:project ?project .
          }
      }`)
    .prefixes({ hydra, dataCube, api, schema })
    .execute(getClient()))

  await dataset.import(await construct()
    .graph(`
      ?collection
        hydra:manages [
            hydra:property rdf:type ;
            hydra:object dataCube:Source
        ] , [
            hydra:subject <${projectId}> ;
            hydra:property dataCube:source
        ].`)
    .where(`BIND (<${projectId}/sources> as ?collection)`)
    .prefixes({ hydra, dataCube, rdf })
    .execute(getClient()))

  return dataset
}
