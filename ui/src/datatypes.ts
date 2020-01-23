import { expand } from '@zazuko/rdf-vocabularies'
import { DataTypeOption, ResourceId, DataTypeParam } from '@/types'

const defaultParams: DataTypeParam[] = ['default']

export const all: DataTypeOption[] = [
  { name: 'any', uri: expand('xsd:anyAtomicType'), params: defaultParams },
  { name: 'anyURI', uri: expand('xsd:anyURI'), params: defaultParams },
  { name: 'binary', uri: expand('xsd:base64Binary'), params: defaultParams },
  { name: 'boolean', uri: expand('xsd:boolean'), params: [...defaultParams, 'format'] },
  { name: 'date', uri: expand('xsd:date'), params: [...defaultParams, 'format'] },
  { name: 'datetime', uri: expand('xsd:dateTime'), params: [...defaultParams, 'format'] },
  { name: 'dateTimeStamp', uri: expand('xsd:dateTimeStamp'), params: defaultParams },
  { name: 'decimal', uri: expand('xsd:decimal'), params: [...defaultParams, 'format'] },
  { name: 'integer', uri: expand('xsd:integer'), params: [...defaultParams, 'format'] },
  { name: 'long', uri: expand('xsd:long'), params: [...defaultParams, 'format'] },
  { name: 'int', uri: expand('xsd:int'), params: [...defaultParams, 'format'] },
  { name: 'short', uri: expand('xsd:short'), params: [...defaultParams, 'format'] },
  { name: 'byte', uri: expand('xsd:byte'), params: [...defaultParams, 'format'] },
  { name: 'nonNegativeInteger', uri: expand('xsd:nonNegativeInteger'), params: [...defaultParams, 'format'] },
  { name: 'positiveInteger', uri: expand('xsd:positiveInteger'), params: [...defaultParams, 'format'] },
  { name: 'unsignedLong', uri: expand('xsd:unsignedLong'), params: [...defaultParams, 'format'] },
  { name: 'unsignedInt', uri: expand('xsd:unsignedInt'), params: [...defaultParams, 'format'] },
  { name: 'unsignedShort', uri: expand('xsd:unsignedShort'), params: [...defaultParams, 'format'] },
  { name: 'unsignedByte', uri: expand('xsd:unsignedByte'), params: [...defaultParams, 'format'] },
  { name: 'nonPositiveInteger', uri: expand('xsd:nonPositiveInteger'), params: [...defaultParams, 'format'] },
  { name: 'negativeInteger', uri: expand('xsd:negativeInteger'), params: [...defaultParams, 'format'] },
  { name: 'number', uri: expand('xsd:double'), params: [...defaultParams, 'format'] },
  { name: 'duration', uri: expand('xsd:duration'), params: [...defaultParams, 'format'] },
  { name: 'dayTimeDuration', uri: expand('xsd:dayTimeDuration'), params: [...defaultParams, 'format'] },
  { name: 'yearMonthDuration', uri: expand('xsd:yearhMonthDuration'), params: [...defaultParams, 'format'] },
  { name: 'float', uri: expand('xsd:float'), params: [...defaultParams, 'format'] },
  { name: 'gDay', uri: expand('xsd:gDay'), params: [...defaultParams, 'format'] },
  { name: 'gMonth', uri: expand('xsd:gMonth'), params: [...defaultParams, 'format'] },
  { name: 'gMonthDay', uri: expand('xsd:gMonthDay'), params: [...defaultParams, 'format'] },
  { name: 'gYear', uri: expand('xsd:gYear'), params: [...defaultParams, 'format'] },
  { name: 'gYearMonth', uri: expand('xsd:gYearMonth'), params: [...defaultParams, 'format'] },
  { name: 'hexBinary', uri: expand('xsd:hexBinary'), params: defaultParams },
  { name: 'QName', uri: expand('xsd:QName'), params: defaultParams },
  { name: 'string', uri: expand('xsd:string'), params: ['language', ...defaultParams] },
  { name: 'normalizedString', uri: expand('xsd:normalizedString'), params: defaultParams },
  { name: 'token', uri: expand('xsd:token'), params: defaultParams },
  { name: 'language', uri: expand('xsd:language'), params: defaultParams },
  { name: 'Name', uri: expand('xsd:Name'), params: defaultParams },
  { name: 'NMTOKEN', uri: expand('xsd:NMTOKEN'), params: defaultParams },
  { name: 'xml', uri: expand('rdf:xml'), params: defaultParams },
  { name: 'html', uri: expand('rdf:html'), params: defaultParams },
  { name: 'json', uri: expand('csvw:json'), params: defaultParams },
  { name: 'time', uri: expand('xsd:time'), params: [...defaultParams, 'format'] }
]

const numericTypes = ['decimal', 'integer', 'long', 'int', 'short', 'byte', 'nonNegativeInteger', 'positiveInteger', 'unsignedLong', 'unsignedInt', 'unsignedShort', 'unsignedByte', 'nonPositiveInteger', 'negativeInteger', 'number', 'float']

const dateTypes = ['date', 'datetime', 'dateTimeStamp', 'gDay', 'gMonth', 'gMonthDay', 'gYear', 'gYearMonth', 'time']

const durationTypes = ['duration', 'dayTimeDuration', 'yearMonthDuration']

const nameIndex: Record<string, DataTypeOption> = all.reduce((acc, dt) => ({ ...acc, [dt.name]: dt }), {})
const uriIndex: Record<ResourceId, DataTypeOption> = all.reduce((acc, dt) => ({ ...acc, [dt.uri]: dt }), {})

export function byName (name: string): DataTypeOption | null {
  return nameIndex[name] ?? null
}

export function byURI (uri: ResourceId): DataTypeOption | null {
  return uriIndex[uri] ?? null
}

export const defaultURI: ResourceId = expand('xsd:string')

export function isNumericType (name: string): boolean {
  return numericTypes.includes(name)
}

export function isDateType (name: string): boolean {
  return dateTypes.includes(name)
}

export function isDurationType (name: string): boolean {
  return durationTypes.includes(name)
}
