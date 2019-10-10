import cf from 'clownface'
import $rdf from 'rdf-ext'
import express from 'express'
import { select } from '../../sparql'
import { csvw, dataCube, schema, rdf } from '../../namespaces'
import { getTableId } from './index'

export async function getMappingsForTable (req: express.DataCubeRequest, res: express.DataCubeResponse) {
  const tableId = getTableId(req)
  const graph = cf($rdf.dataset(), $rdf.namedNode(`${tableId}/csvw`))

  const columns = await select('name', 'property', 'datatype', 'language')
    .prefixes({ dataCube, schema, rdf })
    .where(`
      ?attribute dataCube:table <${tableId}> .
      ?attribute dataCube:column ?column .
      ?attribute schema:name ?name .
          
      OPTIONAL {
        ?attribute rdf:predicate ?property .
      }
      OPTIONAL {
        ?attribute dataCube:language ?language .
      }
      OPTIONAL {
        ?attribute dataCube:datatype ?datatype .
      }  
    `)
    .execute(req.sparql)

  graph.addOut(rdf.type, csvw.CsvwMapping)
  graph.addOut(csvw.tableSchema, tableSchema => {
    tableSchema.addOut(csvw.aboutUrl, 'http://environment.data.admin.ch/ubd/28/cube/')
    columns.forEach(column => {
      tableSchema.addOut(csvw.columns, csvwColumn => {
        csvwColumn.addOut(csvw.title, column.name.value)
        csvwColumn.addOut(csvw.propertyUrl, column.property.value)
        if (column.datatype) {
          csvwColumn.addOut(csvw.datatype, $rdf.namedNode(column.datatype.value))
        }
        if (column.language) {
          csvwColumn.addOut(csvw.lang, column.language.value)
        }
      })
    })
  })

  res.graph(graph.dataset)
}
