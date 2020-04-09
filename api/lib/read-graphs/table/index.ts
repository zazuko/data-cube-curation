import cf from 'clownface'
import $rdf from 'rdf-ext'
import { ASK, CONSTRUCT } from '@tpluscode/sparql-builder'
import { ask, construct } from '../../sparql'
import { dataCube } from '../../namespaces'
import { rdf, schema } from '@tpluscode/rdf-ns-builders'
import { NotFoundError } from '../../error'
import { extractColumns } from '../../domain/table/identifierTemplate'
import { warning } from '../../log'

export async function getRepresentation (tableId: string) {
  const tableExists = await ask(ASK`<${tableId}> a ${dataCube.Table}`)

  if (!tableExists) {
    throw new NotFoundError()
  }

  const dataset = await construct(CONSTRUCT`
      ?table ?p ?o .
    `.WHERE`
    BIND (<${tableId}> as ?table)

    ?table
        a ${dataCube.Table} ;
        ?p ?o .`)

  const table = cf({ dataset }).has(rdf.type, dataCube.Table)
  const source = table.out(dataCube.source).term
  const identifierTemplate = table.out(dataCube.identifierTemplate).term

  if (source && identifierTemplate) {
    const columns = await extractColumns(source.value, identifierTemplate.value)
    if (columns instanceof Error) {
      warning(`Could not extract columns from table's identifier template: ${columns.message}`)
    } else {
      columns.forEach(column => {
        table.addOut(dataCube.identifierColumn, $rdf.namedNode(column.id), columnNode => {
          columnNode.addOut(schema.name, column.name)
          columnNode.addOut(rdf.type, dataCube.Column)
        })
      })
    }
  }

  return dataset.toStream()
}
