import slug from 'url-slug'
import handle from '../domain/source/events'
import { getClient } from './sparqlClient'
import { insertData } from '../sparql'
import { dataCube, schema, xsd, dtype, api } from '../namespaces'

handle.sourceEvents.on.CsvSourceUploaded(ev => {
  const columns = ev.data.columns.map((name, index) => `
    <${ev.id}> dataCube:column <${ev.id}/${slug(name)}>  .

    <${ev.id}/${slug(name)}>
      a dataCube:Column ;
      schema:name "${name}" ;
      dtype:order "${index}"^^xsd:int .
    `)

  return insertData(`
    <${ev.data.projectId}> dataCube:source <${ev.id}> .
    <${ev.id}>
      a dataCube:Source, dataCube:CsvSource ;
      dataCube:project <${ev.data.projectId}> ;
      schema:name "${ev.data.fileName}" ;
      api:columns <${ev.id}/columns> ;
      dataCube:csvDelimiter """${ev.data.delimiter}""" ;
      dataCube:csvQuote "${ev.data.quote.replace('"', '\\"')}" .
    <${ev.id}/columns> dataCube:source <${ev.id}> .

    ${columns.join('\n')}
  `)
    .prefixes({
      dataCube,
      schema,
      dtype,
      xsd,
      api,
    })
    .execute(getClient())
})
