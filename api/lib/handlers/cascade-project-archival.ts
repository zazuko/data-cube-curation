import { handle, CoreEvents } from '@tpluscode/fun-ddr'
import { ProjectEvents } from '../domain/project/events'
import { select, deleteInsert } from '../sparql'
import { dataCube } from '../namespaces'
import { getClient } from '../read-graphs/sparqlClient'
import { sources, tables } from '../storage/repository'

handle<ProjectEvents, 'ProjectArchived'>('ProjectArchived', function deleteSourcesOfProject(ev) {
  select('source')
    .where(`?source dataCube:project <${ev.id}> ; a dataCube:Source .`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
    .then(bindings => bindings.forEach(async b => {
      const source = await sources.load(b.source.value)
      source
        .delete()
        .commit(sources)
        .catch(console.error)
    }))
    .catch(console.error)
})

handle<ProjectEvents, 'ProjectArchived'>('ProjectArchived', function deleteTablesOfProject(ev) {
  select('table')
    .where(`?table dataCube:project <${ev.id}> ; a dataCube:Table .`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
    .then(bindings => bindings.forEach(async b => {
      const table = await tables.load(b.table.value)
      table
        .delete()
        .commit(tables)
        .catch(console.error)
    }))
    .catch(console.error)
})

handle<CoreEvents, 'AggregateDeleted'>('AggregateDeleted', function removeSource(ev) {
  if (ev.data.types.includes('Source')) {
    deleteInsert(`
      ?source ?p0 ?o0 .
      ?column ?p1 ?o1 .`
    )
      .where(`
        ?source ?p0 ?o0 .
        ?source dataCube:column ?column . 
        ?column ?p1 ?o1 .
  
        FILTER ( ?source = <${ev.id}> )`)
      .prefixes({
        dataCube,
      })
      .execute(getClient())
      .catch(console.error)
  }
})
