import { DESCRIBE } from '@tpluscode/sparql-builder'
import { namedNode } from '@rdfjs/data-model'
import { dataCube } from '../../namespaces'
import { construct } from '../../sparql'

export function getTableAndSource (tableId: string) {
  const table = namedNode(tableId)
  return construct(DESCRIBE`${table} ?source ?attribute ?column ?project ?referencedTable ?mapping ?referencedColumn`
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
      `)
}
