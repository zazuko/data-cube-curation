import cf from 'clownface'
import $rdf from 'rdf-ext'
import { construct } from '../../sparql'
import { getClient } from '../sparqlClient'
import { api, dataCube, dtype, hydra, rdf, schema } from '../../namespaces'

export async function getSourceColumns (sourceId: string) {
  const dataset = $rdf.dataset()
  await dataset.import(await construct()
    .graph(`
      ?source api:columns ?columnsCollection ;
              dataCube:column ?column .

      ?columnsCollection
          a hydra:Collection ;
          hydra:totalItems ?count .

      ?column ?columnProp ?o .`)
    .where(`
      BIND (<${sourceId}> as ?source)
      ?source api:columns ?columnsCollection .

      ?source dataCube:column ?column .

      VALUES ?columnProp
      {
          rdf:type
          schema:name
          dtype:order
      }

      OPTIONAL { ?column ?columnProp ?o . }

      {
          SELECT (COUNT(?column) as ?count)
          {
              BIND (<${sourceId}> as ?source)

              ?source dataCube:column ?column .
          }
      }`)
    .prefixes({
      dtype,
      schema,
      dataCube,
      rdf,
      hydra,
      api,
    })
    .execute(getClient()))

  const graph = cf({ dataset })
  const collection = graph.node($rdf.namedNode(`${sourceId}/columns`))

  const columns = graph
    .node($rdf.namedNode(`${sourceId}`)).out(dataCube.column)
    .map(column => {
      const dtypeOrder = column.out(dtype.order).value

      return {
        column: column.term,
        order: dtypeOrder ? parseInt(dtypeOrder) : 0,
      }
    })
    .sort((left, right) => left.order - right.order)
    .map(item => item.column)

  // TODO: remove the explicit `?source dataCube:column ?column` triples
  collection.addList(hydra.member, columns)

  return dataset
}
