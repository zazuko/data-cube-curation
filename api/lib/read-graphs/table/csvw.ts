import $rdf from 'rdf-ext'
import { describe } from '../../sparql'
import { dataCube, schema, rdf } from '../../namespaces'
import { getClient } from '../sparqlClient'

export async function getTableAndSource (csvwResourceId: string) {
  // eslint-disable-next-line jest/valid-describe
  return $rdf.dataset().import(await describe('?table', '?source', '?attribute', '?column')
    .prefixes({ dataCube, schema, rdf })
    .where(`
        <${csvwResourceId}> dataCube:table ?table .
    
        ?tableId a dataCube:Table;
                     dataCube:source ?source .
                     
         ?source dataCube:column ?column .
      
        OPTIONAL { 
          ?attribute dataCube:table ?tableId
        }
      `)
    .execute(getClient()))
}
