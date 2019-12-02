import { select } from '../../sparql'
import { dataCube } from '../../namespaces'
import { getClient } from '../sparqlClient'

export async function getProjectId (linkedResourceId: string) {
  const results = await select('project')
    .where(`<${linkedResourceId}> dataCube:project ?project .`)
    .prefixes({ dataCube })
    .execute(getClient())

  if (results.length !== 1) {
    return null
  }

  return results[0]['project'].value
}
