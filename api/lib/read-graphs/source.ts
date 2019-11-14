import slug from 'url-slug'
import { SourceEvents } from '../domain/source/events'
import { handle } from '@tpluscode/fun-ddr'
import { getClient } from './sparqlClient'
import { insertData } from '../sparql'
import { dataCube, schema, xsd, dtype } from '../namespaces'

handle<SourceEvents, 'SourceUploaded'>('SourceUploaded', ev => {
  const columns = ev.data.columns.map((name, index) => `
    <${ev.id}> dataCube:column <${ev.id}/${slug(name)}>  .

    <${ev.id}/${slug(name)}> 
      a dataCube:Column ; 
      schema:name "${name}" ;
      dtype:order "${index}"^^xsd:int .
    `)

  insertData(`
    <${ev.data.projectId}> dataCube:source <${ev.id}> .
    <${ev.id}>
      a dataCube:Source, dataCube:CsvSource ;
      dataCube:project <${ev.data.projectId}> ;
      schema:name "${ev.data.fileName}" .

    ${columns.join('\n')}
  `)
    .prefixes({
      dataCube,
      schema,
      dtype,
      xsd,
    })
    .execute(getClient())
    .catch(console.error)
})
