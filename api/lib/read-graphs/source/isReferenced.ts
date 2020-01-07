import { ask } from '../../sparql'
import { getClient } from '../sparqlClient'
import { api, dataCube } from '../../namespaces'

export function isReferenced (sourceId: string) {
  return ask()
    .where(`
        ?s ?uses <${sourceId}>

        MINUS {
            ?s a dataCube:Project
        }
        MINUS {
            <${sourceId}> api:columns ?s
        }
    `)
    .prefixes({
      api,
      dataCube,
    })
    .execute(getClient())
}
