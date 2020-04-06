import { SELECT } from '@tpluscode/sparql-builder'
import { select } from '../../sparql'
import { dataCube } from '../../namespaces'

export async function getProjectId (linkedResourceId: string) {
  const results = await select(SELECT`?project`
    .WHERE`<${linkedResourceId}> ${dataCube.project} ?project .`)

  if (results.length !== 1) {
    return null
  }

  return results[0]['project'].value
}
