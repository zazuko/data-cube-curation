import ProjectEvents from '../domain/project/events'
import { projects, tables } from '../storage/repository'
import { createTable } from '../domain/table'
import { unselectFactTable } from '../domain/project'

ProjectEvents.on.FactTableSourceSelected(function createProjectFactTable (ev) {
  return createTable({
    projectId: ev.id,
    tableName: ev.data.tableName,
    sourceId: ev.data.sourceId,
    identifierTemplate: ev.data.identifierTemplate,
  })
    .commit(tables)
    .catch(async (e) => {
      const project = await projects.load(ev.id)
      await project.mutation(unselectFactTable)(null as never)
        .commit(projects)

      throw e
    })
})
