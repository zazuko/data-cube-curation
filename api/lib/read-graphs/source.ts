import { SourceEvents } from '../domain/source/events'
import { handle } from 'fun-ddr'
import { getClient } from './sparqlClient'
import { deleteInsert, insertData } from '../sparql'
import { dataCube, schema } from '../namespaces'

handle<SourceEvents, 'SourceUploaded'>('SourceUploaded', ev => {
  const columns = ev.data.columns.map(name => `
    <${ev.id}> dataCube:column <${ev.id}/${name}>  .

    <${ev.id}/${name}> 
      a dataCube:Column ; 
      schema:name "${name}" .
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
    })
    .execute(getClient())
    .catch(console.error)
})

handle<SourceEvents, 'SourceArchived'>('SourceArchived', function removeSourceWhenProjectIsArchived (ev) {
  deleteInsert(`?source ?p ?o .`)
    .where(`<${ev.id}> ?p ?o . ?col ?schema:name ?name .`)
    .where(`OPTIONAL { 
      <${ev.id}> dataCube:column ?col . 
      ?col ?schema:name ?name .
    }`)
    .prefixes({
      dataCube,
      schema,
    })
    .execute(getClient())
    .catch(console.error)
})
