import hydraBox from 'hydra-box'
import Parser from '@rdfjs/parser-n3'
import $rdf from 'rdf-ext'
import { createReadStream } from 'fs'
import env from './env'

export default async function (apiPath: string) {
  const parser = new Parser({
    baseIRI: env.BASE_URI,
  })

  let authentication
  if (env.SPARQL_ENDPOINT_USERNAME && env.SPARQL_ENDPOINT_PASSWORD) {
    authentication = {
      user: env.SPARQL_ENDPOINT_USERNAME,
      password: env.SPARQL_ENDPOINT_PASSWORD,
    }
  }

  const options: Record<string, unknown> = {
    debug: true,
    sparqlEndpointUrl: env.READ_MODEL_SPARQL_ENDPOINT,
    sparqlEndpointUpdateUrl: env.SPARQL_UPDATE_ENDPOINT,
    contextHeader: '/context/',
    authentication,
    uploadLimit: env.EXPRESS_UPLOAD_LIMIT || '5MB',
  }

  const apiDocsFile = createReadStream(apiPath)

  return hydraBox('/api', await $rdf.dataset().import(parser.import(apiDocsFile)), options)
}
