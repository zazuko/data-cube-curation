import { CoreEvents, handle } from '@tpluscode/fun-ddr'
import $rdf from 'rdf-ext'
import { construct, deleteInsert, insertData } from '../sparql'
import { dataCube, hydra, rdf, schema } from '../namespaces'
import { getClient } from './sparqlClient'
import { AttributeEvents } from '../domain/attribute/events'

handle<AttributeEvents, 'AttributeAdded'>('AttributeAdded', function addAttributeToReadModel (ev) {
  const builder = insertData(`
      <${ev.id}> a dataCube:Attribute , dataCube:ColumnAttribute ;
        dataCube:table <${ev.data.tableId}> ;
        dataCube:column <${ev.data.columnId}> ;
        schema:name "${ev.data.name}" ;
        rdf:predicate <${ev.data.predicate}> .
  `)

  if (ev.data.datatype) {
    builder.graph(`<${ev.id}> dataCube:datatype <${ev.data.datatype}>`)
  } else if (ev.data.language) {
    builder.graph(`<${ev.id}> dataCube:language "${ev.data.language}"`)
  }

  builder.prefixes({
    dataCube,
    rdf,
    schema,
  })
    .execute(getClient())
    .catch(console.error)
})

handle<CoreEvents, 'AggregateDeleted'>('AggregateDeleted', async function deleteAttributeReadModel (ev) {
  if (ev.data.types.includes('Attribute')) {
    deleteInsert(`
      ?attribute ?p0 ?o0 .`
    )
      .where(`
        ?attribute a dataCube:Attribute .
        ?attribute ?p0 ?o0 .
  
        FILTER ( ?attribute = <${ev.id}> )`)
      .prefixes({
        dataCube,
      })
      .execute(getClient())
      .catch(console.error)
  }
})

export async function getTableAttributes (tableId: string) {
  const collection = $rdf.dataset()

  await collection.import(await construct()
    .graph(`
      <${tableId}/attributes> 
        a hydra:Collection ;
        hydra:member ?attribute ;
        hydra:totalItems ?count .
        
      ?attribute ?p ?o .
    `)
    .where(`
      OPTIONAL {
        ?attribute dataCube:table <${tableId}> .
        ?attribute a dataCube:Attribute .
        ?attribute ?p ?o .
      }`)
    .where(`{
      SELECT (COUNT(?attribute) as ?count) WHERE {
        OPTIONAL {
          ?attribute 
            a dataCube:Attribute ;
            dataCube:table <${tableId}> .
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
      <${tableId}/attributes> hydra:manages [
        hydra:property rdf:type ;
        hydra:object dataCube:Attribute
      ] `)
    .prefixes({ hydra, dataCube, rdf })
    .execute(getClient()))

  return collection
}

export async function getSingleAttribute (attributeId: string) {
  const attribute = $rdf.dataset()

  await attribute.import(await construct()
    .graph(`?attribute ?p ?o`)
    .where(`
      ?attribute a dataCube:Attribute ; ?p ?o .
      
      FILTER ( ?attribute = <${attributeId}> )`)
    .prefixes({
      dataCube,
    })
    .execute(getClient()))

  if (attribute.length === 0) {
    return null
  }

  return attribute
}
