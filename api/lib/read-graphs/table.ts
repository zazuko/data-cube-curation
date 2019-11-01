import { handle, CoreEvents } from '@tpluscode/fun-ddr'
import { ask, deleteInsert, insertData, select } from '../sparql'
import { dataCube, schema } from '../namespaces'
import { getClient } from './sparqlClient'
import { TableEvents } from '../domain/table/events'
import { getTableAttributes } from './attribute'
import { expand } from '@zazuko/rdf-vocabularies'
import { attributes } from '../storage/repository'
import { Quad } from 'rdf-js'

handle<TableEvents, 'FactTableCreated'>('FactTableCreated', function createFactTableTriples(ev) {
  insertData(`
    <${ev.id}>
      a dataCube:Table, dataCube:FactTable ;
      dataCube:source <${ev.data.sourceId}>;
      dataCube:project <${ev.data.projectId}> .
  `)
    .prefixes({
      schema,
      dataCube,
    })
    .execute(getClient())
    .catch(console.error)
})

handle<CoreEvents, 'AggregateDeleted'>('AggregateDeleted', function removeTable(ev) {
  if (ev.data.types.includes('Table')) {
    deleteInsert(`
      ?table ?p0 ?o0 .`
    )
      .where(`
        ?table ?p0 ?o0 .
  
        FILTER ( ?table = <${ev.id}> )`)
      .prefixes({
        dataCube,
      })
      .execute(getClient())
      .catch(console.error)
  }
})

handle<CoreEvents, 'AggregateDeleted'>('AggregateDeleted', async function deleteAttributes(ev) {
  if (ev.data.types.includes('Table')) {
    const hydraCollection = await getTableAttributes(ev.id)

    hydraCollection.match(null, expand('hydra:member')).toArray()
      .map((quad: Quad) => quad.object.value)
      .forEach(async (attributeId: string) => {
        const aggregate = await attributes.load(attributeId)
        aggregate.delete().commit(attributes).catch(console.error)
      })
  }
})

export function getFactTableId(projectId: string) {
  return select('factTable')
    .where(`<${projectId}> dataCube:factTable ?factTable .`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
    .then(bindings => bindings[0].factTable.value)
}

export function existsInTableSource(tableId: string, columnId: string): Promise<boolean> {
  return ask(`
    <${tableId}> dataCube:source ?source .
    ?source dataCube:column <${columnId}> .
  `)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
}

export function getTableSourceId(tableId: string) {
  return select('source')
    .where(`<${tableId}> a dataCube:Table; dataCube:source ?source .`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
    .then(bindings => bindings[0].source.value.replace(process.env.BASE_URI, ''))
}
