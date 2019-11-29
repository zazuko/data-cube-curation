import { construct } from '../../sparql'
import { getClient } from '../sparqlClient'
import { api, dataCube, hydra, rdf, schema } from '../../namespaces'
import $rdf = require('rdf-ext');

export async function getSourceCollection (sourcesCollectionId: string) {
  const dataset = $rdf.dataset()

  await dataset.import(await construct()
    .graph(`
      <${sourcesCollectionId}>
          a hydra:Collection ;
          hydra:member ?source ;
          hydra:totalItems ?count .
  
      ?source
          schema:name ?name ;
          api:sample ?sample .`)
    .where(`
      <${sourcesCollectionId}> dataCube:project ?project .
  
      OPTIONAL {
          ?source a dataCube:Source ;
                  dataCube:project ?project ;
                  schema:name ?name .
  
          BIND (iri(CONCAT(replace(str(?source), "/source/", "/source-sample/"))) as ?sample)
      }
  
      {
          SELECT (COUNT(?source) as ?count) WHERE {
              <${sourcesCollectionId}> dataCube:project ?project .
              ?source dataCube:project ?project; a dataCube:Source .
          }
      }`)
    .prefixes({ hydra, dataCube, api, schema })
    .execute(getClient()))

  await dataset.import(await construct()
    .graph(`
      <${sourcesCollectionId}>
        hydra:manages [
            hydra:property rdf:type ;
            hydra:object dataCube:Source
        ] , [
            hydra:subject ?project ;
            hydra:property dataCube:source
        ].`)
    .where(`<${sourcesCollectionId}> dataCube:project ?project .`)
    .prefixes({ hydra, dataCube, rdf })
    .execute(getClient()))

  return dataset
}
