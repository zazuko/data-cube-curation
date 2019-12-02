import { construct } from '../../sparql'
import { getClient } from '../sparqlClient'
import { api, dataCube, rdf, schema } from '../../namespaces'

export function getSource (sourceId: string) {
  return construct()
    .graph(`?source ?prop ?value ; api:sample ?sample .`)
    .where(`
      BIND (<${sourceId}> as ?source)

      VALUES ?prop
      {
          rdf:type
          schema:name
          dataCube:project
      }
  
      OPTIONAL {
          ?source ?prop ?value .
          BIND (iri(CONCAT(replace(str(?source), "/source/", "/source-sample/"))) as ?sample)
      }`
    )
    .prefixes({ rdf, schema, dataCube, api })
    .execute(getClient())
}
