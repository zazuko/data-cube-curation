import { SELECT } from '@tpluscode/sparql-builder'
import { select } from '../../sparql'
import { dataCube } from '../../namespaces'

export async function getIdentifierTemplate (tableId: string, throwIfNotFound = true) {
  const bindings = await select(SELECT`?template`
    .WHERE`
      <${tableId}> a ${dataCube.DimensionTable} ; ${dataCube.identifierTemplate} ?template .
    `)

  if (bindings.length > 1) {
    throw new Error(`Found more than one identifier template for table ${tableId}`)
  }
  if (bindings.length === 0) {
    if (throwIfNotFound) {
      throw new Error(`Identifier template for table ${tableId} was not found`)
    }

    return null
  }

  return bindings[0]['template'].value
}
