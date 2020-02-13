import { CoreEvents } from '@tpluscode/fun-ddr'
import namespace from '@rdfjs/namespace'
import { prefixes } from '@zazuko/rdf-vocabularies'
import AttributeEvents from '../../domain/attribute/events'
import { deleteInsert, insertData } from '../../sparql'
import { dataCube, rdf, schema } from '../../namespaces'
import { getClient } from '../sparqlClient'

const datatype = namespace(prefixes.dataCube + 'datatype/')

AttributeEvents.on.ValueAttributeAdded(function addAttributeToReadModel (ev) {
  const builder = insertData(`
      <${ev.id}> a dataCube:Attribute , dataCube:ValueAttribute ;
        dataCube:table <${ev.data.tableId}> ;
        dataCube:column <${ev.data.columnId}> ;
        dataCube:propertyTemplate "${ev.data.propertyTemplate}" ;
        <${datatype.parameters.value}> _:parameters .
  `)

  Object.entries(ev.data.parameters).forEach(([parameter, value]) => {
    if (value) {
      builder.graph(`_:parameters <${datatype(parameter).value}> "${value}" .`)
    }
  })

  if (ev.data.default) {
    builder.graph(`<${ev.id}> dataCube:default "${ev.data.default}" .`)
  }

  if (ev.data.language) {
    builder.graph(`<${ev.id}> dataCube:language "${ev.data.language}" .`)
  } else if (ev.data.datatype) {
    builder.graph(`<${ev.id}> dataCube:datatype <${ev.data.datatype}> .`)
  }

  return builder.prefixes({
    dataCube,
    rdf,
    schema,
  })
    .execute(getClient())
})

CoreEvents.on.AggregateDeleted(async function deleteAttributeReadModel (ev) {
  if (ev.data.types.includes('Attribute')) {
    await deleteInsert(`
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
  }
})

AttributeEvents.on.ReferenceAttributeAdded(function addReferenceAttributeToReadModel (ev) {
  const builder = insertData(`
      <${ev.id}> a dataCube:Attribute , dataCube:ReferenceAttribute ;
        dataCube:table <${ev.data.tableId}> ;
        dataCube:referencedTable <${ev.data.referencedTableId}> ;
        dataCube:propertyTemplate "${ev.data.propertyTemplate}" .
  `)

  ev.data.columnMappings.forEach(mapping => {
    builder.graph(`
      <${ev.id}> dataCube:columnMapping [
        dataCube:sourceColumn <${mapping.sourceColumnId}> ;
        dataCube:referencedColumn <${mapping.referencedColumnId}> ;
      ] .
    `)
  })

  return builder.prefixes({
    dataCube,
    rdf,
    schema,
  })
    .execute(getClient())
})
