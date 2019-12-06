import { parseGraph } from '../../__tests-helpers__'

const sourceWithColumn = (sourceId: string) => `
    <${sourceId}> dataCube:column <${sourceId}/column1> .
    <${sourceId}/column1> a dataCube:Column; schema:name "Column 1" .
`

export const sourceWithColumnGraph = (sourceId: string) => parseGraph(sourceWithColumn(sourceId))()
