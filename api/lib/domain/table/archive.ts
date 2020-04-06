import { mutate } from '@tpluscode/fun-ddr'
import { ASK } from '@tpluscode/sparql-builder'
import { namedNode } from '@rdfjs/data-model'
import { Table } from './index'
import { TableEvents } from './events'
import { ask } from '../../sparql'
import { dataCube } from '../../namespaces'

export const archiveTable = mutate<Table, never, TableEvents>(async (state, cmd, emitter) => {
  const table = namedNode(state['@id'])
  const isFactTable = await ask(ASK`${table} a ${dataCube.FactTable} .`)

  emitter.emit.TableArchived({
    isFactTable,
    projectId: state.projectId,
  })

  return state
})
