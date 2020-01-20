import $rdf from 'rdf-ext'
import { construct } from '../sparql'
import { api, dataCube, hydra, rdf, schema } from '../namespaces'
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

      ?attribute ?p ?o .
    `)
    .where(`<${tableId}> a dataCube:Table ; api:attributes ?attributes .`)
    .where(`
      OPTIONAL {
        ?attribute dataCube:table <${tableId}> .
        ?attribute a dataCube:Attribute .
        ?attribute ?p ?o .

        FILTER (?p != dataCube:columnMapping )
      }`)
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

  await collection.import(await construct()
    .graph(`
      ?attribute dataCube:columnMapping [
        dataCube:sourceColumn ?sourceColumn ;
        dataCube:referencedColumn ?referencedColumn ;
      ] .

      ?sourceColumn schema:name ?sourceName .
      ?referencedColumn schema:name ?referencedName .`)
    .where(`
      ?attribute dataCube:table <${tableId}> .
      ?attribute dataCube:columnMapping [
        dataCube:sourceColumn ?sourceColumn ;
        dataCube:referencedColumn ?referencedColumn ;
      ] .

      ?sourceColumn schema:name ?sourceName .
      ?referencedColumn schema:name ?referencedName .
    `)
    .prefixes({ dataCube, schema })
    .execute(getClient()))

  return collection
}

export async function getSingleAttribute (attributeId: string) {
  const attribute = $rdf.dataset()

  await attribute.import(await construct()
    .graph(`
      ?attribute ?p ?o .
      ?attribute dataCube:columnMapping ?mapping .
      ?mapping ?mappingO ?mappingP .
    `)
    .where(`
      ?attribute a dataCube:Attribute ; ?p ?o .

      FILTER ( ?attribute = <${attributeId}> )`)
    .where(`OPTIONAL {
      ?attribute dataCube:columnMapping ?mapping .
      ?mapping ?mappingO ?mappingP .
    }`)
    .prefixes({
      dataCube,
    })
    .execute(getClient()))

  if (attribute.length === 0) {
    return null
  }

  return attribute.map(quad => {
    if (rdf.predicate.equals(quad.predicate)) {
      return $rdf.quad(
        quad.subject,
        dataCube.propertyTemplate,
        quad.object,
      )
    }

    return quad
  })
}
