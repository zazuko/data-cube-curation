import { DomainEvent } from '@tpluscode/fun-ddr/lib'
import { insertData, deleteInsert } from '../../sparql'
import { api, dataCube, schema } from '../../namespaces'
import { getClient } from '../sparqlClient'
import TableEvents, { TableEvents as EventTypes } from '../../domain/table/events'
import { NamedNode } from 'rdf-js'

function addTableLinks (ev: DomainEvent) {
  return insertData(`
    <${ev.id}>
        api:csvwMetadata <${ev.id}/csvw> ;
        api:attributes <${ev.id}/attributes> ;
        api:preview <${ev.id}/preview> .
    <${ev.id}/csvw> dataCube:table <${ev.id}> .
    <${ev.id}/attributes> dataCube:table <${ev.id}> .
    <${ev.id}/preview> dataCube:table <${ev.id}> .
  `)
    .prefixes({
      dataCube,
      api,
    })
    .execute(getClient())
}

TableEvents.on.FactTableCreated(addTableLinks)
TableEvents.on.DimensionTableCreated(addTableLinks)

function createTable (type: NamedNode) {
  return (ev: DomainEvent<EventTypes['FactTableCreated']> | DomainEvent<EventTypes['DimensionTableCreated']>) => {
    const identifierTemplate = ev.data.identifierTemplate || ''
    const data = `
    <${ev.id}>
      a dataCube:Table, <${type.value}> ;
      dataCube:source <${ev.data.sourceId}>;
      dataCube:project <${ev.data.projectId}> ;
      schema:name "${ev.data.tableName}" ;
      dataCube:identifierTemplate "${identifierTemplate}" .
  `

    return insertData(data)
      .prefixes({
        schema,
        dataCube,
      })
      .execute(getClient())
  }
}

TableEvents.on.FactTableCreated(createTable(dataCube.FactTable))

TableEvents.on.DimensionTableCreated(createTable(dataCube.DimensionTable))

TableEvents.on.TableIdentifierTemplateChanged(function updateTemplate (ev) {
  const identifierTemplate = ev.data.identifierTemplate || ''

  return deleteInsert(`
        <${ev.id}> dataCube:identifierTemplate ?template .
    `)
    .insert(`
        <${ev.id}> dataCube:identifierTemplate "${identifierTemplate}" .
    `)
    .where(`
      OPTIONAL {
         <${ev.id}> dataCube:identifierTemplate ?template .
      }
    `)
    .prefixes({ dataCube })
    .execute(getClient())
})

TableEvents.on.TableNameChanged(function updateName (ev) {
  return deleteInsert(`
        <${ev.id}> schema:name ?name .
    `)
    .insert(`
        <${ev.id}> schema:name "${ev.data.name}" .
    `)
    .prefixes({
      dataCube,
      schema,
    })
    .execute(getClient())
})
