import { CoreEvents } from '@tpluscode/fun-ddr'
import { DomainEvent } from '@tpluscode/fun-ddr/lib'
import { sparql } from '@tpluscode/rdf-string'
import { ASK, CONSTRUCT, DELETE, INSERT, SELECT } from '@tpluscode/sparql-builder'
import { hydra, rdf, schema } from '@tpluscode/rdf-ns-builders'
import { update, select, ask, construct } from '../sparql'
import { api, dataCube } from '../namespaces'
import TableEvents, { TableEvents as EventTypes } from '../domain/table/events'
import { getTableAttributes } from './attribute'
import { attributes } from '../storage/repository'
import { NamedNode, Quad } from 'rdf-js'
import env from '../env'

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
    let data = sparql`
     <${ev.id}>
      a ${dataCube.Table}, ${type} ;
      ${dataCube.source} <${ev.data.sourceId}>;
      ${dataCube.project} <${ev.data.projectId}> ;
      ${schema.name} "${ev.data.tableName}" .
    `

    if (ev.data.identifierTemplate) {
      data = sparql`${data}

      <${ev.id}> ${dataCube.identifierTemplate} "${ev.data.identifierTemplate}" .`
    }

    return update(INSERT.DATA`${data}`)
  }
}

TableEvents.on.FactTableCreated(createTable(dataCube.FactTable))

TableEvents.on.DimensionTableCreated(createTable(dataCube.DimensionTable))

CoreEvents.on.AggregateDeleted(async function removeTable (ev) {
  if (ev.data.types.includes('Table')) {
    await update(DELETE`
      ?table ?p0 ?o0 .`
      .WHERE`
        ?table ?p0 ?o0 .

        FILTER ( ?table = <${ev.id}> )`)
  }
})

CoreEvents.on.AggregateDeleted(async function deleteAttributes (ev) {
  if (ev.data.types.includes('Table')) {
    const hydraCollection = await getTableAttributes(ev.id)

    const deletions = hydraCollection.match(null, hydra.member).toArray()
      .map((quad: Quad) => quad.object.value)
      .map(async (attributeId: string) => {
        const aggregate = await attributes.load(attributeId)
        return aggregate.delete().commit(attributes)
      })

    await Promise.all(deletions)
  }
})

export function getFactTableId (factTableCanonicalId: string) {
  return select(SELECT`?factTable`
    .WHERE`
        <${factTableCanonicalId}> ${dataCube.project} ?project.
        ?project ${dataCube.factTable} ?factTable .`)
    .then(bindings => {
      if (bindings.length === 0) {
        return null
      }

      return bindings[0].factTable.value
    })
}

export function existsInTableSource (tableId: string, columnId: string): Promise<boolean> {
  return ask(ASK`
    <${tableId}> ${dataCube.source} ?source .
    ?source ${dataCube.column} <${columnId}> .
  `)
}

export async function getTableSourceId (tableId: string) {
  const bindings = await select(SELECT`?source`
    .WHERE`<${tableId}> a ${dataCube.Table}; ${dataCube.source} ?source .`)

  if (bindings.length === 0) {
    return null
  }

  return bindings[0].source.value.replace(env.BASE_URI, '')
}

export async function getProjectTables (collectionId: string) {
  let collection = await construct(CONSTRUCT`
      <${collectionId}>
        a ${hydra.Collection} ;
        ${hydra.member} ?table ;
        ${hydra.totalItems} ?count .

      ?table ?p ?o .
    `
    .WHERE`<${collectionId}> ${dataCube.project} ?project .`
    .WHERE`
      OPTIONAL {
        ?table ${dataCube.project} ?project .
        ?table a ${dataCube.Table} .
        ?table ?p ?o .
      }`
    .WHERE`{
      SELECT (COUNT(?table) as ?count) WHERE {
        <${collectionId}> ${dataCube.project} ?project .
        OPTIONAL {
          ?table
            a ${dataCube.Table} ;
            ${dataCube.project} ?project .
        }
      }
    }`)

  collection = collection.merge(await construct(CONSTRUCT`
      <${collectionId}> ${hydra.manages} [
        ${hydra.property} ${rdf.type} ;
        ${hydra.object} ${dataCube.Table}
      ] `))

  return collection
}
