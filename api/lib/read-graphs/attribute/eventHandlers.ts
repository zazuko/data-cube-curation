import { handle } from '@tpluscode/fun-ddr'
import { AttributeEvents } from '../../domain/attribute/events'
import { insertData } from '../../sparql'
import { dataCube, rdf, schema } from '../../namespaces'
import { getClient } from '../sparqlClient'

handle<AttributeEvents, 'ReferenceAttributeAdded'>('ReferenceAttributeAdded', function addReferenceAttributeToReadModel (ev) {
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
