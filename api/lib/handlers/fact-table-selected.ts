import ProjectEvents from '../domain/project/events'
import { tables } from '../storage/repository'
import { createTable } from '../domain/table'

ProjectEvents.on.FactTableSourceSelected(function createProjectFactTable (ev) {
  return createTable({
    projectId: ev.id,
    tableName: ev.data.tableName,
    sourceId: ev.data.sourceId,
    identifierTemplate: ev.data.identifierTemplate,
  })
    .commit(tables)
})
