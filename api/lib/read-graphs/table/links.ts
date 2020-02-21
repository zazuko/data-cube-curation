import { SELECT } from '@tpluscode/sparql-builder'
import { execute } from '../../sparql'
import { dataCube } from '../../namespaces'

export async function getTableId (linedResourceId: string) {
  const results = await execute(SELECT`?table`
    .WHERE`<${linedResourceId}> ${dataCube.table} ?table .`)

  if (results.length !== 1) {
    return null
  }

  return results[0]['table'].value
}
