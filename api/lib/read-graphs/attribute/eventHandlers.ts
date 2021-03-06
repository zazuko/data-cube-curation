import { CoreEvents } from '@tpluscode/fun-ddr'
import namespace from '@rdfjs/namespace'
import { prefixes } from '@zazuko/rdf-vocabularies'
import { DELETE, INSERT } from '@tpluscode/sparql-builder'
import AttributeEvents from '../../domain/attribute/events'
import { update } from '../../sparql'
import { dataCube } from '../../namespaces'

const datatype = namespace(prefixes.dataCube + 'datatype/')

AttributeEvents.on.ValueAttributeAdded(function addAttributeToReadModel (ev) {
  let query = INSERT.DATA`
      <${ev.id}> a ${dataCube.Attribute} , ${dataCube.ValueAttribute} ;
        ${dataCube.table} <${ev.data.tableId}> ;
        ${dataCube.column} <${ev.data.columnId}> ;
        ${dataCube.propertyTemplate} "${ev.data.propertyTemplate}" ;
        <${datatype.parameters.value}> _:parameters .
  `

  Object.entries(ev.data.parameters).forEach(([parameter, value]) => {
    if (value) {
      query = query.DATA`_:parameters ${datatype(parameter)} "${value}" .`
    }
  })

  if (ev.data.default) {
    query = query.DATA`<${ev.id}> ${dataCube.default} "${ev.data.default}" .`
  }

  if (ev.data.language) {
    query = query.DATA`<${ev.id}> ${dataCube.language} "${ev.data.language}" .`
  } else if (ev.data.datatype) {
    query = query.DATA`<${ev.id}> ${dataCube.datatype} <${ev.data.datatype}> .`
  }

  return update(query)
})

CoreEvents.on.AggregateDeleted(async function deleteAttributeReadModel (ev) {
  if (ev.data.types.includes('Attribute')) {
    await update(DELETE`
      ?attribute ?p0 ?o0 .
      ?p1 ?s1 ?attribute .
      ?param ?p ?o .`
      .WHERE`
        ?attribute a ${dataCube.Attribute} .
        OPTIONAL { ?attribute ?p0 ?o0 . }
        OPTIONAL { ?p1 ?s1 ?attribute . }
        OPTIONAL {
          ?attribute ${datatype.parameters} ?param .
          ?param ?p ?o .
        }

        FILTER ( ?attribute = <${ev.id}> )`)
  }
})

AttributeEvents.on.ReferenceAttributeAdded(function addReferenceAttributeToReadModel (ev) {
  let query = INSERT.DATA`
      <${ev.id}> a ${dataCube.Attribute} , ${dataCube.ReferenceAttribute} ;
        ${dataCube.table} <${ev.data.tableId}> ;
        ${dataCube.referencedTable} <${ev.data.referencedTableId}> ;
        ${dataCube.propertyTemplate} "${ev.data.propertyTemplate}" .
  `

  ev.data.columnMappings.forEach(mapping => {
    query = query.DATA`
      <${ev.id}> ${dataCube.columnMapping} [
        ${dataCube.sourceColumn} <${mapping.sourceColumnId}> ;
        ${dataCube.referencedColumn} <${mapping.referencedColumnId}> ;
      ] .
    `
  })

  return update(query)
})
