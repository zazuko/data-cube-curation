import { CoreEvents } from '@tpluscode/fun-ddr'
import { ask, construct, deleteInsert, select } from '../sparql'
import { dataCube, hydra, rdf } from '../namespaces'
import { getClient } from './sparqlClient'
import { getTableAttributes } from './attribute'
import { attributes } from '../storage/repository'
import { Quad } from 'rdf-js'
import $rdf from 'rdf-ext'
import env from '../env'
import './table/eventHandlers'

CoreEvents.on.AggregateDeleted(async function removeTable (ev) {
  if (ev.data.types.includes('Table')) {
    await deleteInsert(`
      ?table ?p0 ?o0 .`
    )
      .where(`
        ?table ?p0 ?o0 .

        FILTER ( ?table = <${ev.id}> )`)
      .prefixes({
        dataCube,
      })
      .execute(getClient())
  }
})

CoreEvents.on.AggregateDeleted(async function deleteAttributes (ev) {
  if (ev.data.types.includes('Table')) {
    const hydraCollection = await getTableAttributes(ev.id)

    const deletions = hydraCollection.match(null, hydra.member).toArray()
      .map((quad: Quad) => quad.object.value)
      .map(async (attributeId: string) => {
        const aggregate = await attributes.load(attributeId)
        return aggregate.delete().commit(attributes)
      })

    await Promise.all(deletions)
  }
})

export function getFactTableId (factTableCanonicalId: string) {
  return select('factTable')
    .where(`
        <${factTableCanonicalId}> dataCube:project ?project.
        ?project dataCube:factTable ?factTable .`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
    .then(bindings => {
      if (bindings.length === 0) {
        return null
      }

      return bindings[0].factTable.value
    })
}

export function existsInTableSource (tableId: string, columnId: string): Promise<boolean> {
  return ask(`
    <${tableId}> dataCube:source ?source .
    ?source dataCube:column <${columnId}> .
  `)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
}

export async function getTableSourceId (tableId: string) {
  const bindings = await select('source')
    .where(`<${tableId}> a dataCube:Table; dataCube:source ?source .`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())

  if (bindings.length === 0) {
    return null
  }

  return bindings[0].source.value.replace(env.BASE_URI, '')
}

export async function getProjectTables (collectionId: string) {
  const collection = $rdf.dataset()

  await collection.import(await construct()
    .graph(`
      <${collectionId}>
        a hydra:Collection ;
        hydra:member ?table ;
        hydra:totalItems ?count .

      ?table ?p ?o .
    `)
    .where(`<${collectionId}> dataCube:project ?project .`)
    .where(`
      OPTIONAL {
        ?table dataCube:project ?project .
        ?table a dataCube:Table .
        ?table ?p ?o .
      }`)
    .where(`{
      SELECT (COUNT(?table) as ?count) WHERE {
        <${collectionId}> dataCube:project ?project .
        OPTIONAL {
          ?table
            a dataCube:Table ;
            dataCube:project ?project .
        }
      }
    }`)
    .prefixes({
      dataCube,
      hydra,
    })
    .execute(getClient()))

  await collection.import(await construct()
    .graph(`
      <${collectionId}> hydra:manages [
        hydra:property rdf:type ;
        hydra:object dataCube:Table
      ] `)
    .prefixes({ hydra, dataCube, rdf })
    .execute(getClient()))

  return collection
}
