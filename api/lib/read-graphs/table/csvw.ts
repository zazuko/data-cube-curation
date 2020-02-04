import $rdf from 'rdf-ext'
import { describe } from '../../sparql'
import { dataCube, schema, rdf } from '../../namespaces'
import { getClient } from '../sparqlClient'

export async function getTableAndSource (tableId: string) {
  return $rdf.dataset().import(await describe(tableId, '?source', '?attribute', '?column', '?project', '?referencedTable', '?mapping', '?referencedColumn')
    .prefixes({ dataCube, schema, rdf })
    .where(`
        <${tableId}> a dataCube:Table ;
                   dataCube:source ?source ;
                   dataCube:project ?project .

        ?source dataCube:column ?column .

        OPTIONAL {
          ?attribute dataCube:table <${tableId}> .
        }

        OPTIONAL {
          ?attribute dataCube:referencedTable ?referencedTable ;
                     dataCube:columnMapping ?mapping .
          ?mapping dataCube:referencedColumn ?referencedColumn .
        }
      `)
    .execute(getClient()))
}
