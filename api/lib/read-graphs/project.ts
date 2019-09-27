import rdfFetch from 'hydra-box/lib/rdfFetch'
import SparqlHttp from 'sparql-http-client'
import { ProjectEvents } from '../domain/project/events'
import { handle } from '../ddd/events'
import { ask, construct, deleteInsert, insertData } from '../sparql'
import { api, dataCube, hydra, schema } from '../namespaces'

let sparqlClient
function getClient () {
  sparqlClient = sparqlClient || new SparqlHttp({
    endpointUrl: process.env.READ_MODEL_SPARQL_ENDPOINT,
    updateUrl: process.env.READ_MODEL_SPARQL_UPDATE_ENDPOINT || process.env.READ_MODEL_SPARQL_ENDPOINT,
    fetch: rdfFetch,
  })

  return sparqlClient
}

handle<ProjectEvents, 'ProjectCreated'>('ProjectCreated', async (ev) => {
  insertData(`
    <${ev.id}> a dataCube:Project; schema:name "${ev.data.name}" .
  `)
    .prefixes({
      schema,
      dataCube,
    })
    .execute(getClient())
    .catch(console.error)
})

handle<ProjectEvents, 'ProjectRenamed'>('ProjectRenamed', async (ev) => {
  deleteInsert(`<${ev.id}> schema:name ?currentName .`)
    .insert(`<${ev.id}> schema:name "${ev.data.name}" .`)
    .prefixes({
      schema,
      dataCube,
    })
    .execute(getClient())
    .catch(console.error)
})

export function exists (id: string) {
  return ask(`<${id}> ?p ?o`).execute(getClient())
}

export function getProject (id: string): Promise<any> {
  return construct()
    .prefixes({
      api,
      dataCube,
      schema,
      hydra,
    })
    .graph(`
    ?project a ?projectType ;
      schema:name ?name ;
      api:sources ?sources ;
      dataCube:factTable ?factTable .

    ?sources
        a hydra:Collection ;
        hydra:member ?source ;
        hydra:totalItems ?count .

    ?source schema:name ?sourceName`)
    .where(`
    BIND (<${id}> as ?project)
    BIND (<${id}/sources> as ?sources)
    BIND (<${id}/fact-table> as ?factTable)

    ?project
        schema:name ?name ;
        a ?projectType .

    OPTIONAL
    {
        ?project dataCube:source ?source .
        ?source schema:name ?sourceName .
    }

    {
        SELECT (COUNT(?source) as ?count)
        {
            OPTIONAL { ?project dataCube:source ?source }
        }
  }`).execute(getClient())
}
