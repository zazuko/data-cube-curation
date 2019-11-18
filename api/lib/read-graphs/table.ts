import { handle, CoreEvents } from '@tpluscode/fun-ddr'
import { ask, construct, deleteInsert, insertData, select } from '../sparql'
import { dataCube, hydra, rdf, schema } from '../namespaces'
import { getClient } from './sparqlClient'
import { TableEvents } from '../domain/table/events'
import { getTableAttributes } from './attribute'
import { expand } from '@zazuko/rdf-vocabularies'
import { attributes } from '../storage/repository'
import { Quad } from 'rdf-js'
import $rdf from 'rdf-ext'

handle<TableEvents, 'FactTableCreated'>('FactTableCreated', function createFactTableTriples (ev) {
  return insertData(`
    <${ev.id}>
      a dataCube:Table, dataCube:FactTable ;
      dataCube:source <${ev.data.sourceId}>;
      dataCube:project <${ev.data.projectId}> ;
      schema:name "${ev.data.tableName}" .
  `)
    .prefixes({
      schema,
      dataCube,
    })
    .execute(getClient())
})

handle<TableEvents, 'DimensionTableCreated'>('DimensionTableCreated', function createDimensionTableTriples (ev) {
  return insertData(`
    <${ev.id}>
      a dataCube:Table, dataCube:DimensionTable;
      dataCube:source <${ev.data.sourceId}>;
      dataCube:project <${ev.data.projectId}> ;
      schema:name "${ev.data.tableName}" ;
      dataCube:identifierTemplate "${ev.data.identifierTemplate}" .
  `)
    .prefixes({
      schema,
      dataCube,
    })
    .execute(getClient())
})

handle<CoreEvents, 'AggregateDeleted'>('AggregateDeleted', function removeTable (ev) {
  if (ev.data.types.includes('Table')) {
    return deleteInsert(`
      ?table ?p0 ?o0 .`
    )
      .where(`
        ?table ?p0 ?o0 .
  
        FILTER ( ?table = <${ev.id}> )`)
      .prefixes({
        dataCube,
      })
      .execute(getClient())
  }
})

handle<CoreEvents, 'AggregateDeleted'>('AggregateDeleted', async function deleteAttributes (ev) {
  if (ev.data.types.includes('Table')) {
    const hydraCollection = await getTableAttributes(ev.id)

    const deletions = hydraCollection.match(null, expand('hydra:member')).toArray()
      .map((quad: Quad) => quad.object.value)
      .map(async (attributeId: string) => {
        const aggregate = await attributes.load(attributeId)
        return aggregate.delete().commit(attributes)
      })

    await Promise.all(deletions)
  }
})

export function getFactTableId (projectId: string) {
  return select('factTable')
    .where(`<${projectId}> dataCube:factTable ?factTable .`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
    .then(bindings => {
      if (bindings.length === 0) {
        return null
      }

      return bindings[0].factTable.value
    })
}

export function existsInTableSource (tableId: string, columnId: string): Promise<boolean> {
  return ask(`
    <${tableId}> dataCube:source ?source .
    ?source dataCube:column <${columnId}> .
  `)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
}

export function getTableSourceId (tableId: string) {
  return select('source')
    .where(`<${tableId}> a dataCube:Table; dataCube:source ?source .`)
    .prefixes({
      dataCube,
    })
    .execute(getClient())
    .then(bindings => bindings[0].source.value.replace(process.env.BASE_URI, ''))
}

export async function getProjectTables (projectId: string) {
  const collection = $rdf.dataset()

  await collection.import(await construct()
    .graph(`
      <${projectId}/tables> 
        a hydra:Collection ;
        hydra:member ?table ;
        hydra:totalItems ?count .
        
      ?table ?p ?o .
    `)
    .where(`
      OPTIONAL {
        ?table dataCube:project <${projectId}> .
        ?table a dataCube:Table .
        ?table ?p ?o .
      }`)
    .where(`{
      SELECT (COUNT(?table) as ?count) WHERE {
        OPTIONAL {
          ?table 
            a dataCube:Table ;
            dataCube:project <${projectId}> .
        }
      }
    }`)
    .prefixes({
      dataCube,
      hydra,
    })
    .execute(getClient()))

  await collection.import(await construct()
    .graph(`
      <${projectId}/tables> hydra:manages [
        hydra:property rdf:type ;
        hydra:object dataCube:Table
      ] `)
    .prefixes({ hydra, dataCube, rdf })
    .execute(getClient()))

  return collection
}
