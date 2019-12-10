import cf from 'clownface'
import $rdf from 'rdf-ext'
import { NamedNode, Literal } from 'rdf-js'
import { ask, construct } from '../../sparql'
import { api, dataCube, rdf, schema } from '../../namespaces'
import { getClient } from '../sparqlClient'
import { NotFoundError } from '../../error'
import { extractColumns } from '../../domain/table/identifierTemplate'
import { warning } from '../../log'

export async function getRepresentation (tableId: string) {
  const tableExists = await ask(`<${tableId}> a dataCube:Table`)
    .prefixes({ dataCube })
    .execute(getClient())

  if (!tableExists) {
    throw new NotFoundError()
  }

  const dataset = $rdf.dataset()
  await dataset.import(await construct()
    .graph(`
      ?table ?p ?o .
    `)
    .where(`
    BIND (<${tableId}> as ?table)

    ?table
        a dataCube:Table ;
        ?p ?o .`)
    .prefixes({ dataCube, api })
    .execute(getClient()))

  const table = cf({ dataset }).has(rdf.type, dataCube.Table)
  const source = table.out(dataCube.source).term as NamedNode
  const identifierTemplate = table.out(dataCube.identifierTemplate).term as Literal

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
