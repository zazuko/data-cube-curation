import { literal } from 'rdf-data-model'
import Events from '../domain/source/events'
import { deleteInsert } from '../sparql'
import { dataCube, schema } from '../namespaces'
import { getClient } from '../read-graphs/sparqlClient'
import toString = require('@rdfjs/to-ntriples/lib/literal')

const { csvSourceEvents } = Events

csvSourceEvents.on.NameChanged(function updateName (ev) {
  return deleteInsert(`<${ev.id}> schema:name ?current .`)
    .insert(`<${ev.id}> schema:name "${ev.data.newName}"`)
    .prefixes({ schema })
    .execute(getClient())
})

csvSourceEvents.on.QuoteChanged(function updateQuote (ev) {
  return deleteInsert(`<${ev.id}> dataCube:csvQuote ?current .`)
    .insert(`<${ev.id}> dataCube:csvQuote ${toString(literal(ev.data.newQuote))}`)
    .prefixes({ dataCube })
    .execute(getClient())
})

csvSourceEvents.on.DelimiterChanged(function updateDelimiter (ev) {
  return deleteInsert(`<${ev.id}> dataCube:csvDelimiter ?current .`)
    .insert(`<${ev.id}> dataCube:csvDelimiter "${ev.data.newDelimiter}"`)
    .prefixes({ dataCube })
    .execute(getClient())
})
