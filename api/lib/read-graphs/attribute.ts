import $rdf from 'rdf-ext'
import { CONSTRUCT, DESCRIBE } from '@tpluscode/sparql-builder'
import { hydra, rdf } from '@tpluscode/rdf-ns-builders'
import { execute } from '../sparql'
import { api, dataCube, datatype } from '../namespaces'
import './attribute/eventHandlers'

export async function getTableAttributes (tableId: string) {
  const collection = $rdf.dataset()

  await collection.import(await execute(CONSTRUCT`
      ?attributes
        a ${hydra.Collection} ;
        ${hydra.member} ?attribute ;
        ${hydra.totalItems} ?count .
    `
    .WHERE`<${tableId}> a ${dataCube.Table} ; ${api.attributes} ?attributes .
      OPTIONAL {
        ?attribute ${dataCube.table} <${tableId}> .
        ?attribute a ${dataCube.Attribute} .
      }
    {
      SELECT (COUNT(?attribute) as ?count) WHERE {
        OPTIONAL {
          ?attribute
            a ${dataCube.Attribute} ;
            ${dataCube.table} <${tableId}> .
        }
      }
    }`))

  await collection.import(await execute(CONSTRUCT`
      ?attributes ${hydra.manages} [
        ${hydra.property} ${rdf.type} ;
        ${hydra.object} ${dataCube.Attribute}
      ] `
    .WHERE`<${tableId}> a ${dataCube.Table} ; ${api.attributes} ?attributes .`))

  await collection.import(await execute(DESCRIBE`?attribute ?params ?mapping`
    .WHERE`
      ?attribute ${dataCube.table} <${tableId}> .
      ?attribute a ${dataCube.Attribute} .

      OPTIONAL {
        ?attribute ${dataCube.columnMapping} ?mapping .
      }

      OPTIONAL {
        ?attribute ${datatype.parameters} ?params .
      }
    `))

  return collection
}

export async function getSingleAttribute (attributeId: string) {
  const attribute = $rdf.dataset()

  await attribute.import(await execute(DESCRIBE`'?attribute ?params ?mapping`
    .WHERE`
      BIND ( <${attributeId}> as ?attribute )

      OPTIONAL {
        ?attribute ${dataCube.columnMapping} ?mapping .
      }

      OPTIONAL {
        ?attribute ${datatype.parameters} ?params .
      }
    `))

  if (attribute.length === 0) {
    return null
  }

  return attribute
}
