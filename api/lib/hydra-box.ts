import hydraBox from 'hydra-box'
import Parser from '@rdfjs/parser-n3'
import rdf from 'rdf-ext'
import { createReadStream } from 'fs'
import { relative } from 'path'
import walk from '@fcostarodrigo/walk'
import { log, warning } from './log'

export default async function (apiDir: string) {
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
    uploadLimit: process.env.EXPRESS_UPLOAD_LIMIT || '5MB',
  }

  const dataset = rdf.dataset()
  const apiDocSources: Promise<unknown>[] = []
  for await (const file of walk(apiDir) as AsyncIterable<string>) {
    if (!file.match(/\.ttl$/)) {
      continue
    }

    const promise = dataset.import(parser.import(createReadStream(file)))
      .then(() => {
        log.extend('hydra-box')('Loaded %s', relative(apiDir, file))
      })
      .catch(e => {
        warning('Failed to load %s: %s', relative(apiDir, file), e.message)
      })
    apiDocSources.push(promise)
  }
  await Promise.all(apiDocSources)

  log('Loaded ApiDocumentation graph with %d triples', dataset.length)
  return hydraBox('/api', dataset, options)
}
