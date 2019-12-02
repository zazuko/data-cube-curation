import { select } from '../../sparql'
import { dataCube } from '../../namespaces'
import { getClient } from '../sparqlClient'

export async function getTableId (linedResourceId: string) {
  const results = await select('table')
    .where(`<${linedResourceId}> dataCube:table ?table .`)
    .prefixes({ dataCube })
    .execute(getClient())

  if (results.length !== 1) {
    return null
  }

  return results[0]['table'].value
}
