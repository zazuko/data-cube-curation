import { namedNode } from '@rdfjs/data-model'
import { DELETE } from '@tpluscode/sparql-builder'
import { schema } from '@tpluscode/rdf-ns-builders'
import Events from '../domain/source/events'
import { update } from '../sparql'
import { dataCube } from '../namespaces'

const { csvSourceEvents } = Events

csvSourceEvents.on.NameChanged(function updateName (ev) {
  const source = namedNode(ev.id)

  return update(DELETE`
    ${source} ${schema.name} ?name .
  `.INSERT`
    ${source} ${schema.name} "${ev.data.newName}" .
  `.WHERE`
    OPTIONAL { ${source} ${schema.name} ?name }
  `)
})

csvSourceEvents.on.QuoteChanged(function updateQuote (ev) {
  const source = namedNode(ev.id)

  return update(DELETE`
    ${source} ${dataCube.csvQuote} ?current .
  `.INSERT`
    ${source} ${dataCube.csvQuote} "${ev.data.newQuote.replace('"', '\\"')}" .
  `.WHERE`
    OPTIONAL { ${source} ${dataCube.csvQuote} ?current }
  `)
})

csvSourceEvents.on.DelimiterChanged(function updateDelimiter (ev) {
  const source = namedNode(ev.id)

  return update(DELETE`
    ${source} ${dataCube.csvDelimiter} ?current .
  `.INSERT`
    ${source} ${dataCube.csvDelimiter} "${ev.data.newDelimiter}" .
  `.WHERE`
    OPTIONAL { ${source} ${dataCube.csvDelimiter} ?current }
  `)
})
