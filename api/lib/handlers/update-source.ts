import { namedNode } from '@rdfjs/data-model'
import { DELETE } from '@tpluscode/sparql-builder'
import { schema } from '@tpluscode/rdf-ns-builders'
import Events from '../domain/source/events'
import { execute } from '../sparql'
import { dataCube } from '../namespaces'

const { csvSourceEvents } = Events

csvSourceEvents.on.NameChanged(function updateName (ev) {
  const source = namedNode(ev.id)

  return execute(DELETE`
    ${source} ${schema.name} ${ev.data.newName} .
  `.INSERT`
    ${source} ${schema.name} ${ev.data.newName} .
  `)
})

csvSourceEvents.on.QuoteChanged(function updateQuote (ev) {
  const source = namedNode(ev.id)

  return execute(DELETE`
    ${source} ${dataCube.csvQuote} ?current .
  `.INSERT`
    ${source} ${dataCube.csvQuote} ${ev.data.newQuote} .
  `)
})

csvSourceEvents.on.DelimiterChanged(function updateDelimiter (ev) {
  const source = namedNode(ev.id)

  return execute(DELETE`
    ${source} ${dataCube.csvDelimiter} ?current .
  `.INSERT`
    ${source} ${dataCube.csvDelimiter} ${ev.data.newDelimiter} .
  `)
})
