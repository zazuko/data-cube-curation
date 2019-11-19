import hydraBox from 'hydra-box'
import Parser from '@rdfjs/parser-n3'
import { dataset } from 'rdf-ext'
import { createReadStream } from 'fs'

export default async function (apiPath: string) {
  const parser = new Parser({
    baseIRI: process.env.BASE_URI,
  })

  let authentication
  if (process.env.SPARQL_ENDPOINT_USERNAME && process.env.SPARQL_ENDPOINT_PASSWORD) {
    authentication = {
      user: process.env.SPARQL_ENDPOINT_USERNAME,
      password: process.env.SPARQL_ENDPOINT_PASSWORD,
    }
  }

  const options: Record<string, unknown> = {
    debug: true,
    sparqlEndpointUrl: process.env.READ_MODEL_SPARQL_ENDPOINT,
    sparqlEndpointUpdateUrl: process.env.SPARQL_UPDATE_ENDPOINT,
    contextHeader: '/context/',
    authentication,
  }

  const apiDocsFile = createReadStream(apiPath)

  return hydraBox('/api', await dataset().import(parser.import(apiDocsFile)), options)
}
