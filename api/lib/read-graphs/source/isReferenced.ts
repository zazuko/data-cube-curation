import { ASK } from '@tpluscode/sparql-builder'
import { ask } from '../../sparql'
import { api, dataCube } from '../../namespaces'

export function isReferenced (sourceId: string) {
  return ask(ASK`
        ?s ?uses <${sourceId}>

        MINUS {
            ?s a ${dataCube.Project}
        }
        MINUS {
            <${sourceId}> ${api.columns} ?s
        }
    `)
}
