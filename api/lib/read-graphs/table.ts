import { CoreEvents } from '@tpluscode/fun-ddr'
import { DomainEvent } from '@tpluscode/fun-ddr/lib'
import { ASK, CONSTRUCT, DELETE, INSERT, SELECT } from '@tpluscode/sparql-builder'
import { hydra, rdf, schema } from '@tpluscode/rdf-ns-builders'
import { execute } from '../sparql'
import { api, dataCube } from '../namespaces'
import TableEvents from '../domain/table/events'
import { getTableAttributes } from './attribute'
import { attributes } from '../storage/repository'
import { Quad } from 'rdf-js'
import $rdf from 'rdf-ext'
import env from '../env'

function addTableLinks (ev: DomainEvent) {
  return execute(INSERT.DATA`
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

TableEvents.on.FactTableCreated(function createFactTableTriples (ev) {
  return execute(INSERT.DATA`
    <${ev.id}>
      a ${dataCube.Table}, ${dataCube.FactTable} ;
      ${dataCube.source} <${ev.data.sourceId}>;
      ${dataCube.project} <${ev.data.projectId}> ;
      ${schema.name} "${ev.data.tableName}" .
  `)
})

TableEvents.on.DimensionTableCreated(function createDimensionTableTriples (ev) {
  return execute(INSERT.DATA`
    <${ev.id}>
      a ${dataCube.Table}, ${dataCube.DimensionTable};
      ${dataCube.source} <${ev.data.sourceId}>;
      ${dataCube.project} <${ev.data.projectId}> ;
      ${schema.name} "${ev.data.tableName}" ;
      ${dataCube.identifierTemplate} "${ev.data.identifierTemplate}" .
  `)
})

CoreEvents.on.AggregateDeleted(async function removeTable (ev) {
  if (ev.data.types.includes('Table')) {
    await execute(DELETE`
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
  return execute(SELECT`?factTable`
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
  return execute(ASK`
    <${tableId}> ${dataCube.source} ?source .
    ?source ${dataCube.column} <${columnId}> .
  `)
}

export async function getTableSourceId (tableId: string) {
  const bindings = await execute(SELECT`?source`
    .WHERE`<${tableId}> a ${dataCube.Table}; ${dataCube.source} ?source .`)

  if (bindings.length === 0) {
    return null
  }

  return bindings[0].source.value.replace(env.BASE_URI, '')
}

export async function getProjectTables (collectionId: string) {
  const collection = $rdf.dataset()

  await collection.import(await execute(CONSTRUCT`
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
    }`))

  await collection.import(await execute(CONSTRUCT`
      <${collectionId}> ${hydra.manages} [
        ${hydra.property} ${rdf.type} ;
        ${hydra.object} ${dataCube.Table}
      ] `))

  return collection
}
