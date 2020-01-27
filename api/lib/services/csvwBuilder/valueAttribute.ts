import { RdfResource } from '@tpluscode/rdfine'
import { literal } from '@rdfjs/data-model'
import { shrink } from '@zazuko/rdf-vocabularies'
import * as Table from '../../read-model/Table/index'
import * as Csvw from '@rdfine/csvw'
import { csvw, rdf } from '../../namespaces'

const xsdPrefix = /^xsd:(.+)/

function getBuiltInDatatypeName (datatype: RdfResource): string | null {
  switch (datatype.id.value) {
    case (csvw.JSON.value):
      return 'json'
    case (rdf.HTML.value):
      return 'html'
    case (rdf.XMLLiteral.value):
      return 'xml'
  }

  const shrunk = shrink(datatype.id.value)
  const matches = shrunk.match(xsdPrefix)

  if (!matches) {
    return null
  }

  switch (matches[1]) {
    case 'double':
      return 'number'
    case 'base64Binary':
      return 'binary'
    case 'dateTime':
      return 'datetime'
    case 'anyAtomicType':
      return 'any'
  }

  return matches[1]
}

export function valueAttributeToCsvwColumn (attribute: Table.ValueAttribute, csvwColumn: Csvw.Column) {
  csvwColumn.default = attribute.default

  if (attribute.language) {
    csvwColumn.language = attribute.language
  } else if (attribute.datatype) {
    const builtInType = getBuiltInDatatypeName(attribute.datatype)
    const hasParameters = attribute.parameters && Object.entries(attribute.parameters).length > 0

    if (builtInType && hasParameters) {
      const derivedDatatype = csvwColumn._create(csvwColumn._node.blankNode())
      derivedDatatype[csvw.base.value] = literal(builtInType)

      Object.entries(attribute.parameters)
        .forEach(([param, value]) => {
          derivedDatatype[csvw(param).value] = literal(value)
        })

      csvwColumn.datatype = derivedDatatype
    } else {
      csvwColumn.datatype = attribute.datatype
    }
  }

  return csvwColumn
}
