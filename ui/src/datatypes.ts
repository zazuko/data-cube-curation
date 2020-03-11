import { expand } from '@zazuko/rdf-vocabularies'
import { DataTypeOption, DataTypeOptionKind as Kind, ResourceId, DataTypeParam } from '@/types'

const defaultParams = ['default']
const kindParams = {
  [Kind.Any]: defaultParams,
  [Kind.Numeric]: ['default', 'format'],
  [Kind.Date]: ['default', 'format'],
  [Kind.Duration]: ['default', 'format'],
}

export const all: DataTypeOption[] = [
  { name: 'any', uri: 'xsd:anyAtomicType', kind: Kind.Any },
  { name: 'anyURI', uri: 'xsd:anyURI', kind: Kind.Any },
  { name: 'binary', uri: 'xsd:base64Binary', kind: Kind.Any },
  { name: 'boolean', uri: 'xsd:boolean', kind: Kind.Any, params: [...defaultParams, 'format'] },
  { name: 'date', uri: 'xsd:date', kind: Kind.Date },
  { name: 'dateTime', uri: 'xsd:dateTime', kind: Kind.Date },
  { name: 'dateTimeStamp', uri: 'xsd:dateTimeStamp', kind: Kind.Date },
  { name: 'decimal', uri: 'xsd:decimal', kind: Kind.Numeric },
  { name: 'integer', uri: 'xsd:integer', kind: Kind.Numeric },
  { name: 'long', uri: 'xsd:long', kind: Kind.Numeric },
  { name: 'int', uri: 'xsd:int', kind: Kind.Numeric },
  { name: 'short', uri: 'xsd:short', kind: Kind.Numeric },
  { name: 'byte', uri: 'xsd:byte', kind: Kind.Numeric },
  { name: 'nonNegativeInteger', uri: 'xsd:nonNegativeInteger', kind: Kind.Numeric },
  { name: 'positiveInteger', uri: 'xsd:positiveInteger', kind: Kind.Numeric },
  { name: 'unsignedLong', uri: 'xsd:unsignedLong', kind: Kind.Numeric },
  { name: 'unsignedInt', uri: 'xsd:unsignedInt', kind: Kind.Numeric },
  { name: 'unsignedShort', uri: 'xsd:unsignedShort', kind: Kind.Numeric },
  { name: 'unsignedByte', uri: 'xsd:unsignedByte', kind: Kind.Numeric },
  { name: 'nonPositiveInteger', uri: 'xsd:nonPositiveInteger', kind: Kind.Numeric },
  { name: 'negativeInteger', uri: 'xsd:negativeInteger', kind: Kind.Numeric },
  { name: 'number', uri: 'xsd:double', kind: Kind.Numeric },
  { name: 'duration', uri: 'xsd:duration', kind: Kind.Duration },
  { name: 'dayTimeDuration', uri: 'xsd:dayTimeDuration', kind: Kind.Duration },
  { name: 'yearMonthDuration', uri: 'xsd:yearhMonthDuration', kind: Kind.Duration },
  { name: 'float', uri: 'xsd:float', kind: Kind.Numeric },
  { name: 'gDay', uri: 'xsd:gDay', kind: Kind.Date },
  { name: 'gMonth', uri: 'xsd:gMonth', kind: Kind.Date },
  { name: 'gMonthDay', uri: 'xsd:gMonthDay', kind: Kind.Date },
  { name: 'gYear', uri: 'xsd:gYear', kind: Kind.Date },
  { name: 'gYearMonth', uri: 'xsd:gYearMonth', kind: Kind.Date },
  { name: 'hexBinary', uri: 'xsd:hexBinary', kind: Kind.Any },
  { name: 'QName', uri: 'xsd:QName', kind: Kind.Any },
  { name: 'string', uri: 'xsd:string', kind: Kind.Any, params: ['language', ...defaultParams] },
  { name: 'normalizedString', uri: 'xsd:normalizedString', kind: Kind.Any },
  { name: 'token', uri: 'xsd:token', kind: Kind.Any },
  { name: 'language', uri: 'xsd:language', kind: Kind.Any },
  { name: 'Name', uri: 'xsd:Name', kind: Kind.Any },
  { name: 'NMTOKEN', uri: 'xsd:NMTOKEN', kind: Kind.Any },
  { name: 'xml', uri: 'rdf:xml', kind: Kind.Any },
  { name: 'html', uri: 'rdf:html', kind: Kind.Any },
  { name: 'json', uri: 'csvw:json', kind: Kind.Any },
  { name: 'time', uri: 'xsd:time', kind: Kind.Date },
].map((dt) => ({
  ...dt,
  uri: expand(dt.uri),
  params: (dt.params ?? kindParams[dt.kind]) as DataTypeParam[],
}))

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
  return byName(name)?.kind === Kind.Numeric
}

export function isDateType (name: string): boolean {
  return byName(name)?.kind === Kind.Date
}

export function isDurationType (name: string): boolean {
  return byName(name)?.kind === Kind.Duration
}
