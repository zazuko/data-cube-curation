import $rdf from 'rdf-ext'
import { DESCRIBE } from '@tpluscode/sparql-builder'
import { namedNode } from '@rdfjs/data-model'
import { dataCube } from '../../namespaces'
import { execute } from '../../sparql'

export async function getTableAndSource (tableId: string) {
  const table = namedNode(tableId)
  return $rdf.dataset().import(await execute(DESCRIBE`${table} ?source ?attribute ?column ?project ?referencedTable ?mapping ?referencedColumn`
    .WHERE`
        <${tableId}> a ${dataCube.Table} ;
                   ${dataCube.source} ?source ;
                   ${dataCube.project} ?project .

        ?source ${dataCube.column} ?column .

        OPTIONAL {
          ?attribute ${dataCube.table} <${tableId}> .
        }

        OPTIONAL {
          ?attribute ${dataCube.referencedTable} ?referencedTable ;
                     ${dataCube.columnMapping} ?mapping .
          ?mapping ${dataCube.referencedColumn} ?referencedColumn .
        }
      `))
}
