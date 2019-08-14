import cf from 'clownface'
import rdf from 'rdf-ext'
import { getProjectId } from './'
import { select } from '../sparql'
import { csvw, xsd } from '../namespaces'

export async function projectMappings (req, res) {
  const projectUrl = getProjectId(req)

  const graph = cf(rdf.dataset(), rdf.namedNode(`${projectUrl}/csvw`))

  const columns = await select(req.sparql, `
PREFIX hydra: <http://www.w3.org/ns/hydra/core#>
BASE <https://rdf-cube-curation.described.at/>

SELECT *
{
    <${projectUrl}> <DataCubeProject/column> ?column .

    ?column <DataCubeColumn/title> ?title .
}`)

  graph.addOut(csvw.tableSchema, tableSchema => {
    tableSchema.addOut(csvw.aboutUrl, 'http://environment.data.admin.ch/ubd/28/cube/')
    columns.forEach(column => {
      tableSchema.addOut(csvw.columns, csvwColumn => {
        csvwColumn.addOut(csvw.titles, column.title.value)
        csvwColumn.addOut(csvw.suppressOutput, graph.node('true', { datatype: xsd.boolean }))
        csvwColumn.addOut(csvw.propertyUrl, `http://environment.data.admin.ch/ubd/28/${column.title.value}`)
      })
    })
  })

  res.graph(graph.dataset)
}
