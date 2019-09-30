import { handle } from '../ddd/events'
import { ProjectEvents } from '../domain/project/events'
import { select } from '../sparql'
import { dataCube } from '../namespaces'
import { getClient } from '../read-graphs/sparqlClient'
import { sources } from '../storage/repository'

handle<ProjectEvents, 'ProjectArchived'>('ProjectArchived', function archiveSourcesOfProject (ev) {
  select('source')
    .where(`?source dataCube:project <${ev.id}> .`)
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
