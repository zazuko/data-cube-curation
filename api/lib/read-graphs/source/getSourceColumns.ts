import { construct } from '../../sparql'
import { getClient } from '../sparqlClient'
import { api, dataCube, dtype, hydra, rdf, schema } from '../../namespaces'

export function getSourceColumns (sourceId: string) {
  return construct()
    .graph(`
      ?source api:columns ?columnsCollection .
  
      ?columnsCollection
          hydra:member ?column ;
          a hydra:Collection ;
          hydra:totalItems ?count .
  
      ?column ?columnProp ?o .`)
    .where(`
      BIND (<${sourceId}> as ?source)
      BIND (<${sourceId}/columns> as ?columnsCollection)
  
      ?source dataCube:column ?column .
  
      VALUES ?columnProp
      {
          rdf:type
          schema:name
          dtype:order
      }
  
      OPTIONAL { ?column ?columnProp ?o . }
  
      {
          SELECT (COUNT(?column) as ?count)
          {
              BIND (<${sourceId}> as ?source)
  
              ?source dataCube:column ?column .
          }
      }`)
    .prefixes({
      dtype,
      schema,
      dataCube,
      rdf,
      hydra,
      api,
    })
    .execute(getClient())
}
