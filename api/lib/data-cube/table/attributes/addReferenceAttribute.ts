import cf from 'clownface'
import $rdf from 'rdf-ext'
import asyncMiddleware from 'middleware-async'
import { Request, Response } from 'express'
import { expand } from '@zazuko/rdf-vocabularies'
import { getTableId } from '../../../read-graphs/table/links'
import { NotFoundError, RequestError } from '../../../error'
import { buildVariables } from '../../../buildVariables'
import { attributes, tables } from '../../../storage/repository'
import { addReferenceAttribute } from '../../../domain/table/addReferenceAttribute'
import { getSingleAttribute } from '../../../read-graphs/attribute'
import { dataCube } from '../../../namespaces'
import env from '../../../env'

function readColumnMappingsFromRequest (req: Request, columnMappingNodes) {
  const graph = cf({ dataset: req.graph })

  return columnMappingNodes.terms.reduce((mappings, node) => {
    const mappingNode = graph.node(node)
    if (!mappingNode.term) {
      throw new RequestError(`Could not process ${expand('dataCube:columnMapping')} nodes`)
    }

    const sourceColumn = mappingNode.out(dataCube.sourceColumn).term
    const referencedColumn = mappingNode.out(dataCube.referencedColumn).term

    if (!sourceColumn || !referencedColumn) {
      throw new RequestError(`Could not process ${expand('dataCube:columnMapping')} nodes`)
    }

    return [
      ...mappings,
      {
        sourceColumnId: sourceColumn.value,
        referencedColumnId: referencedColumn.value,
      },
    ]
  }, [])
}

export const addReferenceAttributeHandler = asyncMiddleware(async (req: Request, res: Response) => {
  const tableId = await getTableId(req.resourceId)
  if (!tableId) {
    throw new NotFoundError()
  }

  const { predicate, referencedTableId, columnMappingNodes } = buildVariables(req, {
    predicate: expand('rdf:predicate'),
    referencedTableId: expand('dataCube:referencedTable'),
    columnMappingNodes: expand('dataCube:columnMapping'),
  })
  const columnMappings = readColumnMappingsFromRequest(req, columnMappingNodes)

  const aggregate = await tables.load(tableId)
  const table = await aggregate.state
  if (!table) {
    res.status(404)
    res.end()
    return
  }

  const attribute = await aggregate.factory(addReferenceAttribute)({
    predicate: predicate && predicate.value,
    referencedTableId: referencedTableId && referencedTableId.value,
    columnMappings,
  })

  const newAttribute = await attribute.commit(attributes)

  res.status(201)
  res.setHeader('Location', `${env.BASE_URI}${newAttribute['@id']}`)
  res.graph(await getSingleAttribute(newAttribute['@id']) || $rdf.dataset())
})
