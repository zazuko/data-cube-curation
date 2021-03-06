import slug from 'url-slug'
import { INSERT } from '@tpluscode/sparql-builder'
import { xsd, schema, dtype } from '@tpluscode/rdf-ns-builders'
import handle from '../domain/source/events'
import { update } from '../sparql'
import { dataCube, api } from '../namespaces'

handle.sourceEvents.on.CsvSourceUploaded(ev => {
  const coreTriples = INSERT.DATA`
    <${ev.data.projectId}> ${dataCube.source} <${ev.id}> .
    <${ev.id}>
      a ${dataCube.Source}, ${dataCube.CsvSource} ;
      ${dataCube.project} <${ev.data.projectId}> ;
      ${schema.name} "${ev.data.fileName}" ;
      ${api.columns} <${ev.id}/columns> ;
      ${dataCube.csvDelimiter} """${ev.data.delimiter}""" ;
      ${dataCube.csvQuote} "${ev.data.quote.replace('"', '\\"')}" .
    <${ev.id}/columns> ${dataCube.source} <${ev.id}> .
  `

  const withColumns = ev.data.columns.reduce((insert, name, index) => {
    return insert.DATA`<${ev.id}> ${dataCube.column} <${ev.id}/${slug(name)}>  .

    <${ev.id}/${slug(name)}>
      a ${dataCube.Column} ;
      ${schema.name} "${name}" ;
      ${dtype.order} "${index}"^^${xsd.int} .`
  }, coreTriples)

  return update(withColumns)
})
