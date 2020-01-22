import $rdf from 'rdf-ext'
import { construct, describe } from '../sparql'
import { api, dataCube, hydra, rdf } from '../namespaces'
import { getClient } from './sparqlClient'
import './attribute/eventHandlers'

export async function getTableAttributes (tableId: string) {
  const collection = $rdf.dataset()

  await collection.import(await construct()
    .graph(`
      ?attributes
        a hydra:Collection ;
        hydra:member ?attribute ;
        hydra:totalItems ?count .
    `)
    .where(`<${tableId}> a dataCube:Table ; api:attributes ?attributes .`)
    .where(`
      OPTIONAL {
        ?attribute dataCube:table <${tableId}> .
        ?attribute a dataCube:Attribute .
      }
    `)
    .where(`{
      SELECT (COUNT(?attribute) as ?count) WHERE {
        OPTIONAL {
          ?attribute
            a dataCube:Attribute ;
            dataCube:table <${tableId}> .
        }
      }
    }`)
    .prefixes({
      dataCube,
      hydra,
      api,
    })
    .execute(getClient()))

  await collection.import(await construct()
    .graph(`
      ?attributes hydra:manages [
        hydra:property rdf:type ;
        hydra:object dataCube:Attribute
      ] `)
    .where(`<${tableId}> a dataCube:Table ; api:attributes ?attributes .`)
    .prefixes({ hydra, dataCube, rdf, api })
    .execute(getClient()))

  await collection.import(await describe('?attribute', '?params', '?mapping')
    .where(`
      ?attribute dataCube:table <${tableId}> .
      ?attribute a dataCube:Attribute .

      OPTIONAL {
        ?attribute dataCube:columnMapping ?mapping .
      }

      OPTIONAL {
        ?attribute <https://rdf-cube-curation.described.at/datatype/parameters> ?params .
      }
    `)
    .prefixes({
      dataCube,
    })
    .execute(getClient()))

  return collection
}

export async function getSingleAttribute (attributeId: string) {
  const attribute = $rdf.dataset()

  await attribute.import(await describe('?attribute', '?params', '?mapping')
    .where(`
      BIND ( <${attributeId}> as ?attribute )

      OPTIONAL {
        ?attribute dataCube:columnMapping ?mapping .
      }

      OPTIONAL {
        ?attribute <https://rdf-cube-curation.described.at/datatype/parameters> ?params .
      }
    `)
    .prefixes({
      dataCube,
    })
    .execute(getClient()))

  if (attribute.length === 0) {
    return null
  }

  return attribute
}
