import $rdf from 'rdf-ext'
import { DESCRIBE } from '@tpluscode/sparql-builder'
import { namedNode } from '@rdfjs/data-model'
import { execute } from '../../sparql'
import { api } from '../../namespaces'

export async function getSource (sourceId: string) {
  const source = namedNode(sourceId)
  const dataset = await $rdf.dataset().import(await execute(DESCRIBE`${source}`))

  dataset.add($rdf.quad(
    source,
    api.sample,
    $rdf.namedNode(sourceId.replace('/source/', '/source-sample/'))
  ))

  return dataset
}
