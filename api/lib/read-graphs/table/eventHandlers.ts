import { DomainEvent } from '@tpluscode/fun-ddr/lib'
import { INSERT, DELETE } from '@tpluscode/sparql-builder'
import { schema } from '@tpluscode/rdf-ns-builders'
import { update } from '../../sparql'
import { api, dataCube } from '../../namespaces'
import TableEvents, { TableEvents as EventTypes } from '../../domain/table/events'
import { NamedNode } from 'rdf-js'

function addTableLinks (ev: DomainEvent) {
  return update(INSERT.DATA`
    <${ev.id}>
        ${api.csvwMetadata} <${ev.id}/csvw> ;
        ${api.attributes} <${ev.id}/attributes> ;
        ${api.preview} <${ev.id}/preview> .
    <${ev.id}/csvw> ${dataCube.table} <${ev.id}> .
    <${ev.id}/attributes> ${dataCube.table} <${ev.id}> .
    <${ev.id}/preview> ${dataCube.table} <${ev.id}> .
  `)
}

TableEvents.on.FactTableCreated(addTableLinks)
TableEvents.on.DimensionTableCreated(addTableLinks)

function createTable (type: NamedNode) {
  return (ev: DomainEvent<EventTypes['FactTableCreated']> | DomainEvent<EventTypes['DimensionTableCreated']>) => {
    const identifierTemplate = ev.data.identifierTemplate || ''
    const insertData = INSERT.DATA`
    <${ev.id}>
      a ${dataCube.Table}, <${type.value}> ;
      ${dataCube.source} <${ev.data.sourceId}>;
      ${dataCube.project} <${ev.data.projectId}> ;
      ${schema.name} "${ev.data.tableName}" ;
      ${dataCube.identifierTemplate} "${identifierTemplate}" .
  `

    return update(insertData)
  }
}

TableEvents.on.FactTableCreated(createTable(dataCube.FactTable))

TableEvents.on.DimensionTableCreated(createTable(dataCube.DimensionTable))

TableEvents.on.TableIdentifierTemplateChanged(function updateTemplate (ev) {
  const identifierTemplate = ev.data.identifierTemplate || ''

  return update(DELETE`
        <${ev.id}> ${dataCube.identifierTemplate} ?template .
    `
    .INSERT`
        <${ev.id}> ${dataCube.identifierTemplate} "${identifierTemplate}" .
    `
    .WHERE`
      OPTIONAL {
         <${ev.id}> ${dataCube.identifierTemplate} ?template .
      }
    `)
})

TableEvents.on.TableNameChanged(function updateName (ev) {
  return update(DELETE`
        <${ev.id}> ${schema.name} ?name .
    `
    .INSERT`
        <${ev.id}> ${schema.name} "${ev.data.name}" .
    `.WHERE`
        OPTIONAL { <${ev.id}> ${schema.name} ?name }
    `)
})
