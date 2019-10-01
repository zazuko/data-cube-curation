import { handle, CoreEvents } from '@tpluscode/fun-ddr'
import { construct, deleteInsert, insertData } from '../sparql'
import { dataCube, schema } from '../namespaces'
import { getClient } from './sparqlClient'
import { TableEvents } from '../domain/table/events'

handle<TableEvents, 'FactTableCreated'>('FactTableCreated', function createFactTableTriples (ev) {
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

handle<CoreEvents, 'AggregateDeleted'>('AggregateDeleted', function removeTable (ev) {
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

export function getFactTable (projectId: string) {
  return construct()
    .graph('?factTable ?p ?o')
    .where(`<${projectId}> dataCube:factTable ?factTable. ?factTable ?p ?o`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
}
