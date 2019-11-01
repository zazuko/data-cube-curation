import { ProjectEvents } from '../domain/project/events'
import { tables } from '../storage/repository'
import { handle } from '@tpluscode/fun-ddr'
import { createTable } from '../domain/table'

handle<ProjectEvents, 'FactTableSourceSelected'>('FactTableSourceSelected', function createProjectFactTable(ev) {
  createTable({
    projectId: ev.id,
    tableName: ev.data.tableName,
    sourceId: ev.data.sourceId,
  })
    .commit(tables)
    .catch(console.error)
})
