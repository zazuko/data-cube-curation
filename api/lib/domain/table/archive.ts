import { mutate } from '@tpluscode/fun-ddr'
import { Table } from './index'
import { TableEvents } from './events'
import { ask } from '../../sparql'
import { dataCube } from '../../namespaces'
import { getClient } from '../../read-graphs/sparqlClient'

export const archiveTable = mutate<Table, never, TableEvents>(async (state, cmd, emitter) => {
  const isFactTable = await ask(`<${state['@id']}> a dataCube:FactTable`)
    .prefixes({ dataCube })
    .execute(getClient())

  emitter.emit.TableArchived({
    isFactTable,
    projectId: state.projectId,
  })

  return state
})
