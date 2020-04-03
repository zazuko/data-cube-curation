import { turtle } from '@tpluscode/rdf-string'
import { schema } from '@tpluscode/rdf-ns-builders'
import { parseGraph } from '../../__tests-helpers__'
import { dataCube } from '../../namespaces'

const sourceWithColumn = (sourceId: string) => turtle`
    <${sourceId}> ${dataCube.column} <${sourceId}/column1> .
    <${sourceId}/column1> a ${dataCube.Column}; ${schema.name} "Column 1" .
`

export const sourceWithColumnGraph = (sourceId: string) => parseGraph(sourceWithColumn(sourceId))()
