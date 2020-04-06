import { CoreEvents } from '@tpluscode/fun-ddr'
import ProjectEvents from '../domain/project/events'
import { select, update } from '../sparql'
import { DELETE, SELECT } from '@tpluscode/sparql-builder'
import { dataCube } from '../namespaces'
import { sources, tables } from '../storage/repository'

ProjectEvents.on.ProjectArchived(async function deleteSourcesOfProject (ev) {
  await select(SELECT`?source`
    .WHERE`?source ${dataCube.project} <${ev.id}> ; a ${dataCube.Source} .`)
    .then(bindings => bindings.forEach(async b => {
      const source = await sources.load(b.source.value)
      await source
        .delete()
        .commit(sources)
    }))
})

ProjectEvents.on.ProjectArchived(async function deleteTablesOfProject (ev) {
  await select(
    SELECT`?table`
      .WHERE`?table ${dataCube.project} <${ev.id}> ; a ${dataCube.Table} .`
  )
    .then(bindings => bindings.forEach(async b => {
      const table = await tables.load(b.table.value)
      await table
        .delete()
        .commit(tables)
    }))
})

CoreEvents.on.AggregateDeleted(async function removeSource (ev) {
  if (ev.data.types.includes('Source')) {
    await update(DELETE`
      ?source ?p0 ?o0 .
      ?s1 ?p1 ?source .
      ?column ?p2 ?o2 .
      ?s3 ?p3 ?column .`
      .WHERE`
        OPTIONAL { ?source ?p0 ?o0 . }
        OPTIONAL { ?source ${dataCube.column} ?column . }
        OPTIONAL { ?s1 ?p1 ?source . }
        OPTIONAL { ?column ?p2 ?o2 . }
        OPTIONAL { ?s3 ?p3 ?column . }

        FILTER ( ?source = <${ev.id}> )`)
  }
})
