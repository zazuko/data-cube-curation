import { ASK } from '@tpluscode/sparql-builder'
import { execute } from '../../sparql'
import { api, dataCube } from '../../namespaces'

export function isReferenced (sourceId: string) {
  return execute(ASK`
        ?s ?uses <${sourceId}>

        MINUS {
            ?s a ${dataCube.Project}
        }
        MINUS {
            <${sourceId}> ${api.columns} ?s
        }
    `)
}
