import $rdf from 'rdf-ext'
import { describe } from '../../sparql'
import { getClient } from '../sparqlClient'
import { api } from '../../namespaces'

export async function getSource (sourceId: string) {
  const dataset = await $rdf.dataset().import(await describe(sourceId).execute(getClient()))

  dataset.add($rdf.quad(
    $rdf.namedNode(sourceId),
    api.sample,
    $rdf.namedNode(sourceId.replace('/source/', '/source-sample/'))
  ))

  return dataset
}
