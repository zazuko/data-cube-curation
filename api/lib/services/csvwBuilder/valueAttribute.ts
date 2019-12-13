import Clownface from 'clownface/lib/Clownface'
import { csvw, dataCube } from '../../namespaces'

export function valueAttributeToCsvwColumn (attribute: Clownface, csvwColumn: Clownface) {
  if (attribute.out(dataCube.language).value) {
    return csvwColumn.addOut(csvw.lang, attribute.out(dataCube.language))
  }

  if (attribute.out(dataCube.datatype).value) {
    return csvwColumn.addOut(csvw.datatype, attribute.out(dataCube.datatype))
  }

  return csvwColumn
}
